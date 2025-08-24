import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Dropdown from '../dropdown/dropdown.jsx';
import LiveInputHOC from '../forms/live-input-hoc.jsx';
import InputGroup from '../input-group/input-group.jsx';
import Input from '../forms/input.jsx';
import TWRenderRecoloredImage from '../../tw-recolor/render.jsx';
import styles from './dash-array-dropdown.css';

import addIcon from '!../../tw-recolor/build!./add.svg';
import deleteIcon from '!../../tw-recolor/build!./delete.svg';

const LiveInput = LiveInputHOC(Input);
const ModeToolsComponent = props => (
    <Dropdown
        className={classNames(styles.modUnselect, styles.dashArrayDropdown)}
        enterExitTransitionDurationMs={60}
        popoverContent={
            <InputGroup className={styles.dashArrayContextMenu}>
                <div className={styles.table}>
                    {props.dashArray.map((item, index) => (
                        <div className={styles.item}>
                            <LiveInput
                                className={styles.readout}
                                min="0"
                                max="1000"
                                type="number"
                                value={item}
                                onSubmit={value => props.handleChange(index, value)}
                            />
                            <div
                                className={styles.button}
                                onClick={() => props.handleDelete(index)}
                            >
                                <TWRenderRecoloredImage
                                    draggable={false}
                                    src={deleteIcon}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.row}>
                    <div
                        className={styles.button}
                        onClick={props.handleAdd}
                    >
                        <TWRenderRecoloredImage
                            draggable={false}
                            src={addIcon}
                        />
                    </div>
                </div>
            </InputGroup>
        }
        ref={props.componentRef}
        tipSize={.01}
        onOpen={props.onOpenDropdown}
        onOuterAction={props.onClickOutsideDropdown}
    >
        <svg
          width="64"
          height="4"
        >
            <line
              x1="0"
              y1="2"
              x2="64"
              y2="2"
              strokeWidth="4"
              strokeDasharray={props.dashArray.length === 0 ? "0" : props.dashArray.join(" ")}
            />
        </svg>
    </Dropdown>
);

ModeToolsComponent.propTypes = {
    componentRef: PropTypes.func.isRequired,
    dashArray: PropTypes.arrayOf(PropTypes.number),
    onClickOutsideDropdown: PropTypes.func,
    onOpenDropdown: PropTypes.func,
    handleAdd: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
};
export default ModeToolsComponent;
