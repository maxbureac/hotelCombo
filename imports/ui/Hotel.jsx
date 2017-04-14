import React from 'react';
import {Meteor} from 'meteor/meteor';
import {FormsyText, FormsyDate} from 'formsy-material-ui';
import InputRange from 'react-input-range';
import moment from 'moment';
import {Tabs, Tab} from 'material-ui/Tabs';

export default class Hotel extends React.Component {

    render() {
        const hotel = this.props.hotel;
        console.log(hotel);
        return (
            <div className="row">
                <div className="hotel col-md-12">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="row">
                                <div className="centered-img" style={{backgroundImage: "url('" + hotel.photo+ "')"}}>
                                    <img src={hotel.photo} alt="1" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 hotel-details">
                            <h4 className="hotel-name">
                                {hotel.hotel_name}
                            </h4>
                            <div className="hotel-persons-price">
                                <div className="persons-hotel">
                                    <div className="down">
                                        <i className="fa fa-minus"></i>
                                    </div>
                                    <div className="persons">
                                        {hotel.group_rooms[0].num_rooms_available_at_this_price}
                                    </div>
                                    <div className="add-more">
                                        <i className="fa fa-plus"></i>
                                    </div>
                                </div>
                                <div className="price-rating">
                                    <div className="rating">
                                        {hotel.review_score_word} {hotel.review_score}
                                    </div>
                                    <div className="price">
                                        € {hotel.price} in total pp/night
                                    </div>
                                </div>
                            </div>
                            <div className="hotel-address">
                                {hotel.address}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
