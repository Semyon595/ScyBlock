import paper from '@turbowarp/paper';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import DashArrayDropdownComponent from '../components/dash-array-dropdown/dash-array-dropdown.jsx';
import {addValue, changeValue, deleteValue} from '../reducers/dash-array';
import {getSelectedLeafItems} from '../helper/selection';

class DashArrayDropdown extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOpenDropdown',
            'handleClickOutsideDropdown',
            'setDropdown',
            'handleAdd',
            'handleChange',
            'handleDelete',
            'handleChoose'
        ]);
    }
    handleChoose () {
        if (this.dropDown.isOpen()) {
            this.dropDown.handleClosePopover();
            this.props.onUpdateImage();
        }
    }
    handleOpenDropdown () {
        this.savedSelection = getSelectedLeafItems();
        this.dashArray = this.props.dashArray;
    }
    handleClickOutsideDropdown (e) {
        e.stopPropagation();
        this.dropDown.handleClosePopover();
        this.props.onUpdateImage();
        this.dashArray = [];
        this.savedSelection = null;
    }
    setDropdown (element) {
        this.dropDown = element;
    }
    /*getDashArray (selectedItems) {
        if (selectedItems.length === 0) {
            return [];
        }
        const firstStyle = selectedItems[0].getStyle().getDashArray();
        for (const item of selectedItems) {
            if (item.getStyle().getDashArray().join(' ') !== firstStyle.join(' ')) {
                return [];
            }
        }
        return firstStyle;
    }
    handleDashArray (selectedItems, value) {
        let changed;
        for (const item of selectedItems) {
            const styles = item.getStyle();
            if (styles.getDashArray().join(' ') !== value.join(' ')) {
                styles.setDashArray(value);
                changed = true;
            }
        }
        if (changed) {
            this.props.setSelectedItems(this.props.format);
            this.props.onUpdateImage();
        }
        this.forceUpdate();
    }*/
    handleAdd () {
        if (this.dropDown.isOpen()) {
            this.props.addValue();
        }
    }
    handleChange (index, value) {
        if (this.dropDown.isOpen()) {
            this.props.changeValue(index, value);
        }
    }
    handleDelete (index) {
        if (this.dropDown.isOpen()) {
            this.props.deleteValue(index);
        }
    }
    render () {
        return (
            <DashArrayDropdownComponent
                componentRef={this.setDropdown}
                dashArray={this.props.dashArray}
                onChoose={this.handleChoose}
                onClickOutsideDropdown={this.handleClickOutsideDropdown}
                onOpenDropdown={this.handleOpenDropdown}
                handleAdd={this.handleAdd}
                handleChange={this.handleChange}
                handleDelete={this.handleDelete}
            />
        );
    }
}

DashArrayDropdown.propTypes = {
    addValue: PropTypes.func.isRequired,
    changeValue: PropTypes.func.isRequired,
    deleteValue: PropTypes.func.isRequired,
    dashArray: PropTypes.arrayOf(PropTypes.number),
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    dashArray: state.scratchPaint.dashArray
});
const mapDispatchToProps = dispatch => ({
    addValue: () => {
        dispatch(addValue());
    },
    changeValue: (index, value) => {
        dispatch(changeValue(index, value));
    },
    deleteValue: index => {
        dispatch(deleteValue(index));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashArrayDropdown);
