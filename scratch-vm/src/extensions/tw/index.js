const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

// eslint-disable-next-line max-len
const iconURI = `data:image/png;base64,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`;

/**
 * Class for TurboWarp blocks
 * @constructor
 */
class TurboWarpBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'tw',
            name: 'Dash',
            color1: '#ffa34c',
            color2: '#e68d44',
            color3: '#c7693a',
            docsURI: 'https://docs.turbowarp.org/blocks',
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'getLastKeyPressed',
                    text: formatMessage({
                        id: 'tw.blocks.lastKeyPressed',
                        default: 'last key pressed',
                        description: 'Block that returns the last key that was pressed'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getButtonIsDown',
                    text: formatMessage({
                        id: 'tw.blocks.buttonIsDown',
                        default: '[MOUSE_BUTTON] mouse button down?',
                        description: 'Block that returns whether a specific mouse button is down'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        MOUSE_BUTTON: {
                            type: ArgumentType.NUMBER,
                            menu: 'mouseButton',
                            defaultValue: '0'
                        }
                    }
                }
            ],
            menus: {
                mouseButton: {
                    items: [
                        {
                            text: formatMessage({
                                id: 'tw.blocks.mouseButton.primary',
                                default: '(0) primary',
                                description: 'Dropdown item to select primary (usually left) mouse button'
                            }),
                            value: '0'
                        },
                        {
                            text: formatMessage({
                                id: 'tw.blocks.mouseButton.middle',
                                default: '(1) middle',
                                description: 'Dropdown item to select middle mouse button'
                            }),
                            value: '1'
                        },
                        {
                            text: formatMessage({
                                id: 'tw.blocks.mouseButton.secondary',
                                default: '(2) secondary',
                                description: 'Dropdown item to select secondary (usually right) mouse button'
                            }),
                            value: '2'
                        }
                    ],
                    acceptReporters: true
                }
            }
        };
    }

    getLastKeyPressed (args, util) {
        return util.ioQuery('keyboard', 'getLastKeyPressed');
    }

    getButtonIsDown (args, util) {
        const button = Cast.toNumber(args.MOUSE_BUTTON);
        return util.ioQuery('mouse', 'getButtonIsDown', [button]);
    }
}

module.exports = TurboWarpBlocks;
