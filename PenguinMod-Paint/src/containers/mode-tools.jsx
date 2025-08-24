import paper from '@turbowarp/paper';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import CopyPasteHOC from '../hocs/copy-paste-hoc.jsx';
import ModeToolsComponent from '../components/mode-tools/mode-tools.jsx';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {
    setItemSelection,
    deleteSelection,
    getSelectedLeafItems,
    getSelectedRootItems,
    getAllRootItems,
    selectAllItems,
    selectAllSegments
} from '../helper/selection';
import {HANDLE_RATIO, ensureClockwise} from '../helper/math';
import {groupItems, ungroupItems} from '../helper/group';
import {getRaster} from '../helper/layer';
import {flipBitmapHorizontal, flipBitmapVertical, selectAllBitmap} from '../helper/bitmap';
import Formats, {isBitmap} from '../lib/format';
import Modes from '../lib/modes';

class ModeTools extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            '_getSelectedUncurvedPoints',
            '_getSelectedUnpointedPoints',
            'hasSelectedUncurvedPoints',
            'hasSelectedUnpointedPoints',
            'handleCurvePoints',
            'handleFlipHorizontal',
            'handleFlipVertical',
            'handleCenterSelection',
            'handleDelete',
            'handlePasteFromClipboard',
            'handlePointPoints',
            'handleMergeShape',
            'handleMaskShape',
            'handleSubtractShape',
            'handleExcludeShape',
            'handleRoundEnds',
            'handleSquareEnds',
            'handleMiterLineJoin',
            'handleRoundLineJoin',
            'handleBevelLineJoin'
        ]);
    }
    _getSelectedUncurvedPoints () {
        const items = [];
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            if (!item.segments) continue;
            for (const seg of item.segments) {
                if (seg.selected) {
                    const prev = seg.getPrevious();
                    const next = seg.getNext();
                    const isCurved =
                        (!prev || seg.handleIn.length > 0) &&
                        (!next || seg.handleOut.length > 0) &&
                        (prev && next ? seg.handleOut.isColinear(seg.handleIn) : true);
                    if (!isCurved) items.push(seg);
                }
            }
        }
        return items;
    }
    _getSelectedUnpointedPoints () {
        const points = [];
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            if (!item.segments) continue;
            for (const seg of item.segments) {
                if (seg.selected) {
                    if (seg.handleIn.length > 0 || seg.handleOut.length > 0) {
                        points.push(seg);
                    }
                }
            }
        }
        return points;
    }
    hasSelectedUncurvedPoints () {
        const points = this._getSelectedUncurvedPoints();
        return points.length > 0;
    }
    hasSelectedUnpointedPoints () {
        const points = this._getSelectedUnpointedPoints();
        return points.length > 0;
    }
    handleCurvePoints () {
        let changed;
        const points = this._getSelectedUncurvedPoints();
        for (const point of points) {
            const prev = point.getPrevious();
            const next = point.getNext();
            const noHandles = point.handleIn.length === 0 && point.handleOut.length === 0;
            if (!prev && !next) {
                continue;
            } else if (prev && next && noHandles) {
                // Handles are parallel to the line from prev to next
                point.handleIn = prev.point.subtract(next.point)
                    .normalize()
                    .multiply(prev.getCurve().length * HANDLE_RATIO);
            } else if (prev && !next && point.handleIn.length === 0) {
                // Point is end point
                // Direction is average of normal at the point and direction to prev point, using the
                // normal that points out from the convex side
                // Lenth is curve length * HANDLE_RATIO
                const convexity = prev.getCurve().getCurvatureAtTime(.5) < 0 ? -1 : 1;
                point.handleIn = (prev.getCurve().getNormalAtTime(1)
                    .multiply(convexity)
                    .add(prev.point.subtract(point.point).normalize()))
                    .normalize()
                    .multiply(prev.getCurve().length * HANDLE_RATIO);
            } else if (next && !prev && point.handleOut.length === 0) {
                // Point is start point
                // Direction is average of normal at the point and direction to prev point, using the
                // normal that points out from the convex side
                // Lenth is curve length * HANDLE_RATIO
                const convexity = point.getCurve().getCurvatureAtTime(.5) < 0 ? -1 : 1;
                point.handleOut = (point.getCurve().getNormalAtTime(0)
                    .multiply(convexity)
                    .add(next.point.subtract(point.point).normalize()))
                    .normalize()
                    .multiply(point.getCurve().length * HANDLE_RATIO);
            }

            // Point guaranteed to have a handle now. Make the second handle match the length and direction of first.
            // This defines a curved point.
            if (point.handleIn.length > 0 && next) {
                point.handleOut = point.handleIn.multiply(-1);
            } else if (point.handleOut.length > 0 && prev) {
                point.handleIn = point.handleOut.multiply(-1);
            }
            changed = true;
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
    }
    handlePointPoints () {
        let changed;
        const points = this._getSelectedUnpointedPoints();
        for (const point of points) {
            const noHandles = point.handleIn.length === 0 && point.handleOut.length === 0;
            if (!noHandles) {
                point.handleIn = null;
                point.handleOut = null;
                changed = true;
            }
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
    }
    hasSelectedRoundEnds () {
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const style = item.getStyle().getStrokeCap();
            if (style === 'round') {
                return true;
            }
        }
        return false;
    }
    hasSelectedSquareEnds () {
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const style = item.getStyle().getStrokeCap();
            if (style !== 'round') {
                return true;
            }
        }
        return false;
    }
    handleRoundEnds () {
        let changed;
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const styles = item.getStyle();
            if (styles.getStrokeCap() !== 'round') {
                styles.setStrokeCap('round');
                changed = true;
            }
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
    }
    handleSquareEnds () {
        let changed;
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const styles = item.getStyle();
            console.log(styles.getStrokeCap())
            if (styles.getStrokeCap() === 'round') {
                styles.setStrokeCap('butt');
                changed = true;
            }
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
    }
    hasSelectedMiterLineJoins () {
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const style = item.getStyle().getStrokeJoin();
            if (style === 'miter') {
                return true;
            }
        }
        return false;
    }
    hasSelectedRoundLineJoins () {
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const style = item.getStyle().getStrokeJoin();
            if (style === 'round') {
                return true;
            }
        }
        return false;
    }
    hasSelectedBevelLineJoins () {
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const style = item.getStyle().getStrokeJoin();
            if (style === 'bevel') {
                return true;
            }
        }
        return false;
    }
    handleMiterLineJoin () {
        let changed;
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const styles = item.getStyle();
            if (styles.getStrokeJoin() !== 'miter') {
                styles.setStrokeJoin('miter');
                changed = true;
            }
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
    }
    handleRoundLineJoin () {
        let changed;
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const styles = item.getStyle();
            if (styles.getStrokeJoin() !== 'round') {
                styles.setStrokeJoin('round');
                changed = true;
            }
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
    }
    handleBevelLineJoin () {
        let changed;
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            const styles = item.getStyle();
            if (styles.getStrokeJoin() !== 'bevel') {
                styles.setStrokeJoin('bevel');
                changed = true;
            }
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
    }

    handleMergeShape (specificOperation) {
        const selectedItems = getSelectedRootItems();
        if (selectedItems.length < 2) {
            // If nothing or not enough items are selected,
            // we probably shouldnt select and merge everything
            return;
        }
        if (!selectedItems[0].unite) {
            // we cant unite this item, cancel
            return;
        }
        const results = [];
        // unite the shapes together, creating a clone on top of the original
        if (typeof specificOperation === "string") {
            let idx = 0;
            selectedItems.forEach(item => {
                if (idx === 0) {
                    idx++;
                    return;
                }
                const result = selectedItems[0][specificOperation](item);
                results.push(result);
                idx++;
            });
        } else {
            let idx = 0;
            selectedItems.forEach(item => {
                if (idx === 0) {
                    idx++;
                    return;
                }
                const result = selectedItems[0].unite(item);
                results.push(result);
                idx++;
            });
        }

        if (results.length <= 1) {
            setItemSelection(results[0], true);
            this.props.onUpdateImage();
        } else {
            groupItems(results, this.props.clearSelectedItems, this.props.setSelectedItems, this.props.onUpdateImage);
        }
    }

    handleMaskShape () {
        this.handleMergeShape("intersect");
    }
    handleSubtractShape () {
        this.handleMergeShape("subtract");
    }
    handleExcludeShape () {
        this.handleMergeShape("exclude");
    }

    _handleFlip (horizontalScale, verticalScale, selectedItems) {
        if (selectedItems.length === 0) {
            // If nothing is selected, select everything
            selectedItems = getAllRootItems();
        }
        // Record old indices
        for (const item of selectedItems) {
            item.data.index = item.index;
        }

        // Group items so that they flip as a unit
        const itemGroup = new paper.Group(selectedItems);
        // Flip
        itemGroup.scale(horizontalScale, verticalScale);
        ensureClockwise(itemGroup);

        // Remove flipped item from group and insert at old index. Must insert from bottom index up.
        for (let i = 0; i < selectedItems.length; i++) {
            itemGroup.layer.insertChild(selectedItems[i].data.index, selectedItems[i]);
            selectedItems[i].data.index = null;
        }
        itemGroup.remove();

        this.props.onUpdateImage();
    }
    handleFlipHorizontal () {
        const selectedItems = getSelectedRootItems();
        if (isBitmap(this.props.format) && selectedItems.length === 0) {
            getRaster().canvas = flipBitmapHorizontal(getRaster().canvas);
            this.props.onUpdateImage();
        } else {
            this._handleFlip(-1, 1, selectedItems);
        }
    }
    handleFlipVertical () {
        const selectedItems = getSelectedRootItems();
        if (isBitmap(this.props.format) && selectedItems.length === 0) {
            getRaster().canvas = flipBitmapVertical(getRaster().canvas);
            this.props.onUpdateImage();
        } else {
            this._handleFlip(1, -1, selectedItems);
        }
    }
    handleCenterSelection () {
        // https://github.com/Nitro-Bolt/scratch-paint/blob/develop/src/containers/mode-tools.jsx#L203-L216
        let selectedItems = getSelectedRootItems();
        if (selectedItems.length === 0) {
            if (isBitmap(this.props.format)) {
                return;
            }
            selectedItems = getAllRootItems();
        }

        for (const item of selectedItems) {
            item.data.originalIndex = item.index;
        }

        const group = new paper.Group(selectedItems);
        group.position = new paper.Point(this.props.width, this.props.height);
        for (let i = 0; i < selectedItems.length; i++) {
            const item = selectedItems[i];
            group.layer.insertChild(item.data.originalIndex, item);
            delete item.data.originalIndex;
        }
        group.remove();

        this.props.setSelectedItems(this.props.format);
        this.props.onUpdateImage();
    }
    handlePasteFromClipboard () {
        if (this.props.onPasteFromClipboard()) {
            this.props.onUpdateImage();
        }
    }
    handleDelete () {
        if (!this.props.selectedItems.length) {
            if (isBitmap(this.props.format)) {
                selectAllBitmap(this.props.clearSelectedItems);
            } else if (this.props.mode === Modes.RESHAPE) {
                selectAllSegments();
            } else {
                selectAllItems();
            }
        }
        if (deleteSelection(this.props.mode, this.props.onUpdateImage)) {
            this.props.setSelectedItems(this.props.format);
        }
    }
    render () {
        return (
            <ModeToolsComponent
                hasSelectedUncurvedPoints={this.hasSelectedUncurvedPoints()}
                hasSelectedUnpointedPoints={this.hasSelectedUnpointedPoints()}
                onCopyToClipboard={this.props.onCopyToClipboard}
                onCutToClipboard={this.props.onCutToClipboard}
                onCurvePoints={this.handleCurvePoints}
                onDelete={this.handleDelete}
                onFlipHorizontal={this.handleFlipHorizontal}
                onFlipVertical={this.handleFlipVertical}
                onCenterSelection={this.handleCenterSelection}
                onManageFonts={this.props.onManageFonts}
                onPasteFromClipboard={this.handlePasteFromClipboard}
                onPointPoints={this.handlePointPoints}
                onUpdateImage={this.props.onUpdateImage}

                hasSelectedRoundEnds={this.hasSelectedRoundEnds()}
                hasSelectedSquareEnds={this.hasSelectedSquareEnds()}
                onRoundEnds={this.handleRoundEnds}
                onSquareEnds={this.handleSquareEnds}
                hasSelectedMiterLineJoin={this.hasSelectedMiterLineJoins()}
                hasSelectedRoundLineJoin={this.hasSelectedRoundLineJoins()}
                hasSelectedBevelLineJoin={this.hasSelectedBevelLineJoins()}
                onMiterLineJoin={this.handleMiterLineJoin}
                onRoundLineJoin={this.handleRoundLineJoin}
                onBevelLineJoin={this.handleBevelLineJoin}

                onMergeShape={this.handleMergeShape}
                onMaskShape={this.handleMaskShape}
                onSubtractShape={this.handleSubtractShape}
                onExcludeShape={this.handleExcludeShape}
            />
        );
    }
}

ModeTools.propTypes = {
    clearSelectedItems: PropTypes.func.isRequired,
    format: PropTypes.oneOf(Object.keys(Formats)),
    mode: PropTypes.oneOf(Object.keys(Modes)),
    onCopyToClipboard: PropTypes.func.isRequired,
    onCutToClipboard: PropTypes.func.isRequired,
    onManageFonts: PropTypes.func,
    onPasteFromClipboard: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    // Listen on selected items to update hasSelectedPoints
    selectedItems:
        PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)), // eslint-disable-line react/no-unused-prop-types
    setSelectedItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    format: state.scratchPaint.format,
    mode: state.scratchPaint.mode,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    }
});

export default CopyPasteHOC(connect(
    mapStateToProps,
    mapDispatchToProps
)(ModeTools));
