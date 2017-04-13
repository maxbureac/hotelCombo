import React from 'react';
import {Meteor} from 'meteor/meteor';
import {RaisedButton} from 'material-ui';
import {FormsyText, FormsyDate} from 'formsy-material-ui';
import InputRange from 'react-input-range';
import moment from 'moment';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            dataSource: [],
            budget: {
                min: 500,
                max: 1000
            }
        };
    }

    componentWillMount() {
        Meteor.call('api.load_countries', (err, res) => {
            if (!err) {
                this.setState({
                    loading: false
                });
            }
        });
    }
    onFormSubmit(data) {
        _.extend(data, {
            budget: this.state.budget
        });
        Meteor.call('api.perform_search',data, (err, res) => {
           console.log(res);
        });
    }

    render() {
        return (
            <div className="main-wrapper">
                <div className="container-fluid">
                    <div className="row">
                        <div className="top-bar">
                            <div className="container">
                                <div className="logo">
                                    HOTELCOMBO
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="search-wrapper">
                        <Formsy.Form onValidSubmit={this.onFormSubmit.bind(this)}>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-xs-12">
                                    <FormsyText
                                        name="destination"
                                        fullWidth={true}
                                        value=""
                                        floatingLabelText="Type in your destination"
                                    />
                                </div>
                                <div className="col-sm-6 col-md-6 col-xs-12">
                                    <FormsyText
                                        name="numberOfPeople"
                                        validations="isNumeric"
                                        validationError="Please type in a number"
                                        fullWidth={true}
                                        value="10"
                                        floatingLabelText="Type in your destination"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-xs-12">
                                    <FormsyDate
                                        name="checkInDate"
                                        required
                                        container="inline"
                                        fullWidth={true}
                                        value={moment()}
                                    />
                                </div>
                                <div className="col-sm-6 col-md-6 col-xs-12">
                                    <FormsyDate
                                        name="checkOutDate"
                                        required
                                        container="inline"
                                        fullWidth={true}
                                        value={moment()}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 col-sm-12 col-xs-12 budget-range">
                                    <InputRange
                                        maxValue={5000}
                                        minValue={0}
                                        labelSuffix="€"
                                        value={this.state.budget}
                                        onChange={value => this.setState({ budget: value })}
                                        onChangeComplete={value => this.setState({ budget: value })}
                                    />
                                </div>
                            </div>
                            <div className="submit-button text-center" style={{marginTop: '50px'}}>
                                <RaisedButton className="submit-btn" type="submit" label="Search now" primary={true}/>
                            </div>
                        </Formsy.Form>
                    </div>
                </div>
            </div>
        );
    }
}
