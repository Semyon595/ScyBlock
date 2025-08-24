/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {FormattedMessage, FormattedDate, FormattedTime, FormattedRelative, defineMessages, injectIntl, intlShape} from 'react-intl';
import {getIsLoading} from '../reducers/project-state.js';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import TWProjectMetaFetcherHOC from '../lib/tw-project-meta-fetcher-hoc.jsx';
import TWStateManagerHOC from '../lib/tw-state-manager-hoc.jsx';
import SBFileUploaderHOC from '../lib/sb-file-uploader-hoc.jsx';
import TWPackagerIntegrationHOC from '../lib/tw-packager-integration-hoc.jsx';
import SettingsStore from '../addons/settings-store-singleton';
import '../lib/tw-fix-history-api';
import GUI from './render-gui.jsx';
import MenuBar from '../components/menu-bar/menu-bar.jsx';
import ProjectInput from '../components/tw-project-input/project-input.jsx';
import FeaturedProjects from '../components/tw-featured-projects/featured-projects.jsx';
import Description from '../components/tw-description/description.jsx';
import BrowserModal from '../components/browser-modal/browser-modal.jsx';
import DashWelcomeModal from '../containers/dash-welcome-modal.jsx';
import CloudVariableBadge from '../containers/tw-cloud-variable-badge.jsx';
import {isBrowserSupported} from '../lib/tw-environment-support-prober';
import AddonChannels from '../addons/channels';
import {loadServiceWorker} from './load-service-worker';
import runAddons from '../addons/entry';
import InvalidEmbed from '../components/tw-invalid-embed/invalid-embed.jsx';
import {APP_NAME} from '../lib/brand.js';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import TWRenderRecoloredImage from '../lib/tw-recolor/render.jsx';

import aboutIcon from '!../lib/tw-recolor/build!./icons/icon--about.svg';
import unsharedIcon from '!../lib/tw-recolor/build!./icons/icon--unshared.svg';
import cloudIcon from '!../lib/tw-recolor/build!./icons/icon--cloud.svg';
import descriptionIcon from '!../lib/tw-recolor/build!./icons/icon--description.svg';
import whatsNewIcon from '!../lib/tw-recolor/build!./icons/icon--whatsnew.svg';

import styles from './interface.css';
import lazyMessages from '../components/loader/lazy-messages.json'
import Loader from '../components/loader/loader.jsx';

const isInvalidEmbed = window.parent !== window;

// Browser support is not perfect yet
const relativeTimeSupported = () => typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat !== 'undefined';

const handleClickAddonSettings = addonId => {
    // addonId might be a string of the addon to focus on, undefined, or an event (treat like undefined)
    const path = process.env.ROUTING_STYLE === 'wildcard' ? 'addons' : 'addons.html';
    const url = `${process.env.ROOT}${path}${typeof addonId === 'string' ? `#${addonId}` : ''}`;
    window.open(url);
};

const messages = defineMessages({
    defaultTitle: {
        defaultMessage: 'More Blocks, Extensions, and other',
        description: 'Title of homepage',
        id: 'tw.guiDefaultTitle'
    }
});

const tabClassNames = {
    tabs: styles.tabs,
    tab: classNames(tabStyles.reactTabsTab, styles.tab),
    tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
    tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
    tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
    tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected),
    tabDisabled: styles.isDisabled
};

const WrappedMenuBar = compose(
    SBFileUploaderHOC,
    TWPackagerIntegrationHOC
)(MenuBar);

if (AddonChannels.reloadChannel) {
    AddonChannels.reloadChannel.addEventListener('message', () => {
        location.reload();
    });
}

if (AddonChannels.changeChannel) {
    AddonChannels.changeChannel.addEventListener('message', e => {
        SettingsStore.setStoreWithVersionCheck(e.data);
    });
}

const RenderLoader = () => {
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        const handleLoad = () => {
            setPageLoaded(true);
        };

        if (document.readyState === 'complete') {
            setPageLoaded(true);
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    return !pageLoaded ? (
        <Loader
            isFullScreen
            messageId="dash.loader.loadingPage"
        />
    ) : null;
}

const RenderWelcomeModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    function handleOnOpen() {
        setIsOpen(true);
    }

    function handleOnClose() {
        setIsOpen(false);
    }

    return (
        <>
            <a onClick={handleOnOpen}>
                {/* todo: translate */}
                <FormattedMessage
                    defaultMessage="Welcome Modal"
                    description="Link to open welcome modal"
                    id="dash.home.welcomeModal"
                />
            </a>
            {isOpen && <DashWelcomeModal onClose={handleOnClose}/>}
        </>
    );
}

runAddons();

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.footerContent}>
            <div className={styles.footerText}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="{APP_NAME} is not affiliated with Scratch, the Scratch Team, or the Scratch Foundation."
                    description="Disclaimer that TurboWarp is not connected to Scratch"
                    id="tw.footer.disclaimer"
                    values={{
                        APP_NAME
                    }}
                />
            </div>

            <div className={styles.footerText}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="Scratch is a project of the Scratch Foundation. It is available for free at {scratchDotOrg}."
                    description="A disclaimer that Scratch requires when referring to Scratch. {scratchDotOrg} is a link with text 'https://scratch.org/'"
                    id="tw.footer.scratchDisclaimer"
                    values={{
                        scratchDotOrg: (
                            <a
                                href="https://scratch.org/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {'https://scratch.org/'}
                            </a>
                        )
                    }}
                />
            </div>

            <div className={styles.footerText}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="{APP_NAME} is based on TurboWarp and one mod of TurboWarp (we can't mention it here), but not affiliated with these mods. TurboWarp is available for free at: {turbowarpDotOrg}."
                    description="A disclaimer that Dash is a TurboWarp and mod of TurboWarp mod."
                    id="tw.footer.basedOnDisclaimer"
                    values={{
                        APP_NAME,
                        turbowarpDotOrg: (
                            <a
                                href="https://turbowarp.org/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {'https://turbowarp.org/'}
                            </a>
                        ),
                        penguinmodDotCom: (
                            <a
                                href="https://penguinmod.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {'https://penguinmod.com'}
                            </a>
                        )
                    }}
                />
            </div>

            <div className={styles.footerColumns}>
                <div className={styles.footerSection}>
                    <RenderWelcomeModal />
                    <a href="credits.html">
                        <FormattedMessage
                            defaultMessage="Credits"
                            description="Credits link in footer"
                            id="tw.footer.credits"
                        />
                    </a>
                    {/*<a href="...">
                        <FormattedMessage
                            defaultMessage="Donate"
                            description="Donation link in footer"
                            id="tw.footer.donate"
                        />
                    </a>*/}
                </div>
                <div className={styles.footerSection}>
                    <a href="https://desktop.turbowarp.org/">
                        {/* Do not translate */}
                        {'TurboWarp Desktop'}
                    </a>
                    <a href="https://packager.turbowarp.org/">
                        {/* Do not translate */}
                        {'TurboWarp Packager'}
                    </a>
                    <a href="https://docs.turbowarp.org/embedding">
                        <FormattedMessage
                            defaultMessage="Embedding"
                            description="Link in footer to embedding documentation for embedding link"
                            id="tw.footer.embed"
                        />
                    </a>
                    <a href="https://docs.turbowarp.org/url-parameters">
                        <FormattedMessage
                            defaultMessage="URL Parameters"
                            description="Link in footer to URL parameters documentation"
                            id="tw.footer.parameters"
                        />
                    </a>
                    <a href="https://docs.turbowarp.org/">
                        <FormattedMessage
                            defaultMessage="Documentation"
                            description="Link in footer to additional documentation"
                            id="tw.footer.documentation"
                        />
                    </a>
                </div>
                <div className={styles.footerSection}>
                    <a href="https://scratch.mit.edu/discuss/topic/828107/#post-8609237">
                        <FormattedMessage
                            defaultMessage="Our Forum"
                            description="Link to Dash's forum in Scratch"
                            id="dash.home.forum"
                        />
                    </a>
                    <a href="https://scratch.mit.edu/users/damir2809/#comments">
                        <FormattedMessage
                            defaultMessage="Feedback & Bugs"
                            description="Link to feedback/bugs page"
                            id="tw.feedback"
                        />
                    </a>
                    <a href="https://github.com/DashBlocks/">
                        <FormattedMessage
                            defaultMessage="Source Code"
                            description="Link to source code"
                            id="tw.code"
                        />
                    </a>
                    <a href="privacy.html">
                        <FormattedMessage
                            defaultMessage="Privacy Policy"
                            description="Link to privacy policy"
                            id="tw.privacy"
                        />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);

const WhatsNew = () => {
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        fetch('https://api.github.com/repos/DashBlocks/dashblocks.github.io/commits')
            .then(response => response.json())
            .then(data => {
                setCommits(data.slice(0, 10));
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>An error occured</div>;

    return (
        <div className={styles.commitsContainer}>
            {commits.map(commit => {
                const createdDate = new Date(commit.commit.committer.date);
                return (
                    <a
                        key={commit.sha}
                        href={commit.html_url}
                        className={styles.commitLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className={styles.commitItem}>
                            <div className={styles.commitMessage}>
                                {commit.commit.message}
                            </div>
                            <div>
                                {relativeTimeSupported() && (
                                    <span>
                                        <FormattedRelative value={createdDate} />
                                        {' ('}
                                    </span>
                                )}
                                <FormattedDate value={createdDate} />
                                {', '}
                                <FormattedTime value={createdDate} />
                                {relativeTimeSupported() && ')'}
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
};

class Interface extends React.PureComponent {
    constructor (props) {
        super(props);
        this.handleUpdateProjectTitle = this.handleUpdateProjectTitle.bind(this);
        this.state = {
            activeTabIndex: 0,
            messageNumber: 0,
        };
    }
    componentDidUpdate (prevProps) {
        if (prevProps.isLoading && !this.props.isLoading) {
            loadServiceWorker();
        }
    }
    componentDidMount() {
        const sum = lazyMessages.reduce((acc, _) => acc + 1, 0);
        let rand = sum * Math.random();
        for (let i = 0; i < lazyMessages.length; i++) {
            rand -= 1;
            if (rand <= 0) {
                this.setState({
                    messageNumber: i
                });
                break;
            }
        }
    }
    handleUpdateProjectTitle (title, isDefault) {
        if (isDefault || !title) {
            document.title = `${APP_NAME} - ${this.props.intl.formatMessage(messages.defaultTitle)}`;
        } else {
            document.title = `${title} - ${APP_NAME}`;
        }
    }
    onActivateTab (tab) {
        this.setState({
            activeTabIndex: tab
        });
    }
    chooseRandomMessage() {
        return this.state.messageNumber;
    }
    render () {
        if (isInvalidEmbed) {
            return <InvalidEmbed />;
        }

        const {
            /* eslint-disable no-unused-vars */
            intl,
            hasCloudVariables,
            description,
            isFullScreen,
            isLoading,
            isPlayerOnly,
            isRtl,
            projectId,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        const isHomepage = isPlayerOnly && !isFullScreen;
        const isEditor = !isPlayerOnly;
        return (
            <div
                className={classNames(styles.container, {
                    [styles.playerOnly]: isHomepage,
                    [styles.editor]: isEditor
                })}
                dir={isRtl ? 'rtl' : 'ltr'}
            >
                <RenderLoader />
                {isHomepage ? (
                    <WrappedMenuBar
                        canChangeLanguage
                        canManageFiles
                        canChangeTheme
                        enableSeeInside
                        onClickAddonSettings={handleClickAddonSettings}
                    />
                ) : null}
                <div className={styles.center}>
                    <div
                        className={styles.wrapperRegulator}
                        style={isHomepage ? ({
                            width: `${Math.max(480, props.customStageSize.width) + 2}px`
                        }) : null}
                    >
                        <GUI
                            onClickAddonSettings={handleClickAddonSettings}
                            onUpdateProjectTitle={this.handleUpdateProjectTitle}
                            backpackVisible
                            backpackHost="_local_"
                            {...props}
                        />
                    </div>
                    {isHomepage ? (
                        <React.Fragment>
                            {isBrowserSupported() ? null : (
                                <BrowserModal isRtl={isRtl} />
                            )}
                            <div className={styles.mainSection}>
                                <div className={styles.section}>
                                    <ProjectInput />
                                </div>
                                <Tabs
                                    forceRenderTabPanel
                                    className={tabClassNames.tabs}
                                    selectedIndex={this.state.activeTabIndex}
                                    selectedTabClassName={tabClassNames.tabSelected}
                                    selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                    onSelect={this.onActivateTab.bind(this)}
                                >
                                    <TabList className={tabClassNames.tabList}>
                                        <Tab className={tabClassNames.tab}>
                                            <TWRenderRecoloredImage
                                                draggable={false}
                                                src={aboutIcon}
                                            />
                                            <FormattedMessage
                                                defaultMessage="About {APP_NAME}"
                                                description="Button to get to the About Dash panel"
                                                id="dash.home.tab.about"
                                                values={{
                                                    APP_NAME
                                                }}
                                            />
                                        </Tab>
                                        <Tab className={tabClassNames.tab}>
                                            <TWRenderRecoloredImage
                                                draggable={false}
                                                src={whatsNewIcon}
                                            />
                                            <FormattedMessage
                                                defaultMessage="What's new?"
                                                description="Button to get to the What's New? panel"
                                                id="dash.home.tab.whatsNew"
                                            />
                                        </Tab>
                                        <Tab
                                            className={classNames(tabClassNames.tab, {
                                                [tabClassNames.tabDisabled]: !(description.instructions === 'unshared' || description.credits === 'unshared')
                                            })}
                                        >
                                            <TWRenderRecoloredImage
                                                draggable={false}
                                                src={unsharedIcon}
                                            />
                                            <FormattedMessage
                                                defaultMessage="Unshared project"
                                                description="Button to get to the unshared project error panel"
                                                id="dash.home.tab.unshared"
                                            />
                                        </Tab>
                                        <Tab
                                            className={classNames(tabClassNames.tab, {
                                                [tabClassNames.tabDisabled]: !(hasCloudVariables && projectId !== '0')
                                            })}
                                        >
                                            <TWRenderRecoloredImage
                                                draggable={false}
                                                src={cloudIcon}
                                            />
                                            <FormattedMessage
                                                defaultMessage="Cloud variables"
                                                description="Button to get to the cloud variables panel"
                                                id="dash.home.tab.cloud"
                                            />
                                        </Tab>
                                        <Tab
                                            className={classNames(tabClassNames.tab, {
                                                [tabClassNames.tabDisabled]: !(
                                                    (description.instructions || description.credits) &&
                                                    !(description.instructions === 'unshared' || description.credits === 'unshared')
                                                )
                                            })}
                                        >
                                            <TWRenderRecoloredImage
                                                draggable={false}
                                                src={descriptionIcon}
                                            />
                                            <FormattedMessage
                                                defaultMessage="Description"
                                                description="Button to get to the description panel"
                                                id="dash.home.tab.description"
                                            />
                                        </Tab>
                                    </TabList>
                                    <TabPanel className={tabClassNames.tabPanel}>
                                        <div
                                            className={styles.section}
                                            style={{
                                                overflowY: "auto",
                                                maxHeight: "520px"
                                            }}
                                        >
                                            <p>
                                                <FormattedMessage
                                                    // eslint-disable-next-line max-len
                                                    defaultMessage="{APP_NAME} is based on TurboWarp and one of TurboWarp mods mod (we can't mention it here) that adds more blocks, extensions, colors and other and compiles projects to JavaScript to make them run really fast. Try it out by clicking on 'See inside' button or by inputting a project ID or URL above or choosing a featured project below."
                                                    description="Description of Dash on the homepage"
                                                    id="tw.home.description"
                                                    values={{
                                                        APP_NAME
                                                    }}
                                                />
                                            </p>
                                            <FeaturedProjects studio="37103090" />
                                            {/*<p>
                                                {lazyMessages[this.chooseRandomMessage()]}
                                            </p>*/}
                                        </div>
                                    </TabPanel>
                                    <TabPanel className={tabClassNames.tabPanel}>
                                        <div
                                            className={styles.section}
                                            style={{
                                                overflowY: "auto",
                                                maxHeight: "520px"
                                            }}
                                        >
                                            <WhatsNew />
                                        </div>
                                    </TabPanel>
                                    <TabPanel className={tabClassNames.tabPanel}>
                                        {(
                                            description.instructions === 'unshared' || description.credits === 'unshared'
                                        ) && (
                                            <div
                                                className={styles.section}
                                                style={{
                                                    overflowY: "auto",
                                                    maxHeight: "520px"
                                                }}
                                            >
                                                <div className={classNames(styles.infobox, styles.unsharedUpdate)}>
                                                    <p>
                                                        <FormattedMessage
                                                            defaultMessage="Unshared projects are no longer visible."
                                                            description="Appears on unshared projects"
                                                            id="tw.unshared2.1"
                                                        />
                                                    </p>
                                                    <p>
                                                        <FormattedMessage
                                                            defaultMessage="For more information, visit: {link}"
                                                            description="Appears on unshared projects"
                                                            id="tw.unshared.2"
                                                            values={{
                                                                link: (
                                                                    <a
                                                                        href="https://docs.turbowarp.org/unshared-projects"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {'https://docs.turbowarp.org/unshared-projects'}
                                                                    </a>
                                                                )
                                                            }}
                                                        />
                                                    </p>
                                                    <p>
                                                        <FormattedMessage
                                                            // eslint-disable-next-line max-len
                                                            defaultMessage="If the project was shared recently, this message may appear incorrectly for a few minutes."
                                                            description="Appears on unshared projects"
                                                            id="tw.unshared.cache"
                                                        />
                                                    </p>
                                                    <p>
                                                        <FormattedMessage
                                                            // eslint-disable-next-line max-len
                                                            defaultMessage="If this project is actually shared, please report a bug."
                                                            description="Appears on unshared projects"
                                                            id="tw.unshared.bug"
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </TabPanel>
                                    <TabPanel className={tabClassNames.tabPanel}>
                                        {hasCloudVariables && projectId !== '0' && (
                                            <div
                                                className={styles.section}
                                                style={{
                                                    overflowY: "auto",
                                                    maxHeight: "520px"
                                                }}
                                            >
                                                <CloudVariableBadge />
                                            </div>
                                        )}
                                    </TabPanel>
                                    <TabPanel className={tabClassNames.tabPanel}>
                                        {description.instructions || description.credits ? (
                                            <div
                                                className={styles.section}
                                                style={{
                                                    overflowY: "auto",
                                                    maxHeight: "520px"
                                                }}
                                            >
                                                <Description
                                                    instructions={description.instructions}
                                                    credits={description.credits}
                                                    projectId={projectId}
                                                />
                                            </div>
                                        ) : null}
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </React.Fragment>
                    ) : null}
                </div>
                {isHomepage && <Footer />}
            </div>
        );
    }
}

Interface.propTypes = {
    intl: intlShape,
    hasCloudVariables: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    description: PropTypes.shape({
        credits: PropTypes.string,
        instructions: PropTypes.string
    }),
    isFullScreen: PropTypes.bool,
    isLoading: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    hasCloudVariables: state.scratchGui.tw.hasCloudVariables,
    customStageSize: state.scratchGui.customStageSize,
    description: state.scratchGui.tw.description,
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isLoading: getIsLoading(state.scratchGui.projectState.loadingState),
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isRtl: state.locales.isRtl,
    projectId: state.scratchGui.projectState.projectId
});

const mapDispatchToProps = () => ({});

const ConnectedInterface = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(Interface));

const WrappedInterface = compose(
    AppStateHOC,
    ErrorBoundaryHOC('TW Interface'),
    TWProjectMetaFetcherHOC,
    TWStateManagerHOC,
    TWPackagerIntegrationHOC
)(ConnectedInterface);

export default WrappedInterface;
