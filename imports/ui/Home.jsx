import React from 'react';
import {Meteor} from 'meteor/meteor';
import {FormsyText, FormsyDate} from 'formsy-material-ui';
import InputRange from 'react-input-range';
import moment from 'moment';
import {Tabs, Tab} from 'material-ui/Tabs';
import Hotel from './Hotel.jsx';
import {Random} from 'meteor/random';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            dataSource: [],
            budget: {
                min: 500,
                max: 1000
            },
            checkInDate: null,
            checkOutDate: null,
            results: null
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
    onTabChange(tab) {
        if(tab === 'byPrice') {
            this.setState({
                totalShownPrice: this.state.totalPriceByPrice
            })
        } else if (tab === 'byDistance') {
            this.setState({
                totalShownPrice: this.state.totalPriceByDistance
            })
        } else if (tab === 'byRating'){
            this.setState({
                totalShownPrice: this.state.totalPriceByReviewScore
            })
        }
    }
    onFormSubmit(data) {
        _.extend(data, {
            budget: this.state.budget
        });
        Meteor.call('api.perform_search',data, (err, res) => {
            if(res && res !== undefined) {
                let totalPriceByDistance = 0;
                let totalPriceByPrice = 0;
                let totalPriceByReviewScore = 0;
                _.each(res.suitableHotelsByPrice, (hotel) => {
                    totalPriceByPrice = totalPriceByPrice + parseInt(hotel.price);
                });
                _.each(res.suitableHotelsByDistance, (hotel) => {
                    totalPriceByDistance = totalPriceByDistance + parseInt(hotel.price);
                });
                _.each(res.suitableHotelsByReviewScore, (hotel) => {
                    totalPriceByReviewScore = totalPriceByReviewScore + parseInt(hotel.price);
                });
                this.setState({
                    results: res,
                    checkInDate: data.checkInDate,
                    checkOutDate: data.checkOutDate,
                    totalPriceByPrice: totalPriceByPrice,
                    totalPriceByDistance: totalPriceByDistance,
                    totalPriceByReviewScore: totalPriceByReviewScore,
                    totalShownPrice: totalPriceByPrice
                });
                $('.search-wrapper').fadeOut();
                Meteor.setTimeout( () => {
                    $('.search-wrapper-results').removeClass('hidden').fadeIn();
                    $('.results-wrapper').removeClass('hidden').fadeIn();
                }, 700)
            }
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
                                    HotelCombo
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="search-wrapper">
                        <Formsy.Form onValidSubmit={this.onFormSubmit.bind(this)}>
                            <div className="row search-form">
                                <div className="col-sm-6 col-md-3 col-xs-12 search-input text-input">
                                    <FormsyText
                                        name="destination"
                                        fullWidth={true}
                                        value="Amsterdam"
                                        underlineShow={false}
                                        inputStyle={{fontSize: "15px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Location"
                                    />
                                </div>
                                <div className="col-sm-6 col-md-3 col-xs-12 search-input">
                                    <FormsyDate
                                        name="checkInDate"
                                        required
                                        container="inline"
                                        fullWidth={true}
                                        underlineShow={false}
                                        inputStyle={{fontSize: "16px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Check In"
                                    />
                                </div>
                                <div className="col-sm-6 col-md-3 col-xs-12 search-input text-input">
                                    <FormsyDate
                                        name="checkOutDate"
                                        required
                                        container="inline"
                                        underlineShow={false}
                                        inputStyle={{fontSize: "16px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        fullWidth={true}
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Check Out"
                                    />
                                </div>
                                <div className="col-sm-6 col-md-3 col-xs-12 search-input">
                                    <FormsyText
                                        name="numberOfPeople"
                                        validations="isNumeric"
                                        inputStyle={{fontSize: "16px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        validationError="Please type in a number"
                                        fullWidth={true}
                                        underlineShow={false}
                                        value="10"
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Number of people"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <h2 className="budget-title">
                                    Your daily budget
                                </h2>
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
                                <button className="submit-btn" type="submit">
                                    GO!
                                </button>
                            </div>
                        </Formsy.Form>
                    </div>
                    <div className="search-wrapper-results hidden">
                        <Formsy.Form onValidSubmit={this.onFormSubmit.bind(this)}>
                            <div className="row search-form">
                                <div className="col-sm-6 col-md-4 col-xs-12 search-input text-input">
                                    <FormsyText
                                        name="destination"
                                        fullWidth={true}
                                        value="Amsterdam"
                                        underlineShow={false}
                                        inputStyle={{fontSize: "15px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Location"
                                    />
                                </div>
                                <div className="col-sm-6 col-md-2 col-xs-12 search-input">
                                    <FormsyDate
                                        name="checkInDate"
                                        required
                                        container="inline"
                                        fullWidth={true}
                                        underlineShow={false}
                                        value={this.state.checkInDate}
                                        inputStyle={{fontSize: "16px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Check In"
                                    />
                                </div>
                                <div className="col-sm-6 col-md-2 col-xs-12 search-input text-input">
                                    <FormsyDate
                                        name="checkOutDate"
                                        required
                                        container="inline"
                                        underlineShow={false}
                                        value={this.state.checkOutDate}
                                        inputStyle={{fontSize: "16px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        fullWidth={true}
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Check Out"
                                    />
                                </div>
                                <div className="col-sm-6 col-md-2 col-xs-12 search-input">
                                    <FormsyText
                                        name="numberOfPeople"
                                        validations="isNumeric"
                                        inputStyle={{fontSize: "16px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        validationError="Please type in a number"
                                        fullWidth={true}
                                        underlineShow={false}
                                        value="10"
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Number of people"
                                    />
                                </div>
                                <div className="col-sm-6 col-md-2 col-xs-12 search-input">
                                    <FormsyText
                                        name="Your daily budget"
                                        inputStyle={{fontSize: "16px", color: "#F75191", fontWeight: "normal", fontFamily: "Raleway, san-serif"}}
                                        fullWidth={true}
                                        underlineShow={false}
                                        value={this.state.budget.min + ' - ' + this.state.budget.max}
                                        floatingLabelStyle={{color: "#9B9B9B", fontWeight: "bold", fontFamily: "Raleway, san-serif"}}
                                        floatingLabelText="Number of people"
                                    />
                                </div>
                            </div>
                        </Formsy.Form>
                    </div>
                </div>
                {this.state.results
                    ? <div className="container-fluid" style={{paddingTop: "50px",paddingBottom: "50px", background: "#F3F3F3"}}>
                        <div className="results-wrapper hidden">
                            <Tabs>
                                <Tab label="Price combo" onActive={this.onTabChange.bind(this, 'byPrice')}>
                                    <div className="col-md-7">
                                        <div className="map-container" style={{background: "url('/images/map.png')", backgroundSize: "cover"}}>

                                        </div>
                                    </div>
                                    <div className="col-md-5 hotels-container">
                                        {
                                            _.map(this.state.results.suitableHotelsByPrice, (hotel) => {
                                                return <div className="col-md-12">
                                                    <Hotel hotel={hotel} key={Random.id()} />
                                                </div>
                                            })
                                        }
                                    </div>
                                </Tab>
                                <Tab label="Distance Combo" onActive={this.onTabChange.bind(this, 'byDistance')}>
                                    <div className="col-md-7">
                                        <div className="map-container" style={{background: "url('/images/map.png')", backgroundSize: "cover"}}>

                                        </div>
                                    </div>
                                    <div className="col-md-5 hotels-container">
                                        {
                                            _.map(this.state.results.suitableHotelsByDistance, (hotel) => {
                                                return <div className="col-md-12">
                                                    <Hotel hotel={hotel} key={Random.id()} />
                                                </div>
                                            })
                                        }
                                    </div>
                                </Tab>
                                <Tab label="Rating Combo" onActive={this.onTabChange.bind(this, 'byRating')}>
                                    <div className="col-md-7">
                                        <div className="map-container" style={{background: "url('/images/map.png')", backgroundSize: "cover"}}>

                                        </div>
                                    </div>
                                    <div className="col-md-5 hotels-container">
                                        {
                                            _.map(this.state.results.suitableHotelsByReviewScore, (hotel) => {
                                                return <div className="col-md-12">
                                                        <Hotel hotel={hotel} key={Random.id()} />
                                                    </div>
                                            })
                                        }
                                    </div>
                                </Tab>
                            </Tabs>
                            <div className="row">
                                <div className="results-footer">
                                    <a href="http://booking.com" className="book-now-btn">
                                        <span className="total-price">{this.state.totalShownPrice} p.p./n</span><span className="book-now">Book Now</span> <i className="fa fa-chevron-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}
