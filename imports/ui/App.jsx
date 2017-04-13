import React, {Component} from 'react';
import {MuiThemeProvider} from 'material-ui';
import {createContainer} from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class App extends Component {

    render() {
        const muiTheme = getMuiTheme({
            palette: {
                primary1Color: "#F75191",
                accent1Color: "#F75191",
                pickerHeaderColor: "#F75191",
            },
            datePicker: {
                selectColor: "#F75191",
            },
        });
        const {main, routeProps, user} = this.props;

        const readyComponent = (
            <div>
                <div className={`app-main-body ${user ? 'logged-in' : ''}`}>
                    {React.createElement(main, routeProps)}
                </div>
            </div>
        );

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
                <div>
                    { readyComponent }
                </div>
            </MuiThemeProvider>
        );
    }
}

export default createContainer((props = {}) => ({
    ...props
}), App);
