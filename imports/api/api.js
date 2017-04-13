import {Meteor} from 'meteor/meteor';
import moment from 'moment';
Meteor.methods({
    'api.perform_search': function (data) {
        this.unblock();
        let location = Meteor.http.call("GET", "http://maps.google.com/maps/api/geocode/json?address=" + data.destination);
        let result = JSON.parse(location.content);
        let coordinates = result.results[0].geometry.location;
        let checkInDate = moment(data.checkInDate).format('YYYY-MM-DD');
        let checkOutDate = moment(data.checkOutDate).format('YYYY-MM-DD');
        let days = moment(data.checkOutDate).diff(moment(data.checkInDate), 'days');

        let bookingResponse = Meteor.http.call("GET", "https://distribution-xml.booking.com/json/getHotelAvailabilityV2", {
            auth: "hacker236:dMRw8yzW8A",
            params: {
                checkin: checkInDate,
                checkout: checkOutDate,
                longitude: coordinates.lng,
                latitude: coordinates.lat,
                room1: "A",
                max_price: data.budget.max * days,
                min_price: data.budget.min * days,
                output: "room_details,hotel_details",
                order_by: "distance"
            }
        });
        let hotels = JSON.parse(bookingResponse.content).hotels;
        let hotelsByPrice = _.sortBy(hotels, 'price');
        let hotelsByReviewScore = _.sortBy(hotels, 'review_score');
        return Meteor.call('api.pack_hotels', data.numberOfPeople, hotels, hotelsByPrice, hotelsByReviewScore);
    },
    'api.pack_hotels': function (nrOfPeople, hotels, hotelsByPrice, hotelsByReviewScore) {
        return {
            suitableHotelsByDistance: Meteor.call('api.pack', hotels, nrOfPeople),
            suitableHotelsByPrice: Meteor.call('api.pack', hotelsByPrice, nrOfPeople),
            suitableHotelsByReviewScore: Meteor.call('api.pack', hotelsByReviewScore, nrOfPeople),
        }
    },
    'api.pack': function(sortedHotels, nrOfPeople) {
        let suitableCombination = [];
        if (nrOfPeople <= _.first(sortedHotels).group_rooms[0].num_rooms_available_at_this_price) {
            suitableCombination.push(_.first(sortedHotels));
        } else {
            while (nrOfPeople > 0) {
                _.each(sortedHotels, (hotel) => {
                    let hotelCapacity = hotel.group_rooms[0].num_rooms_available_at_this_price;
                    if (nrOfPeople > 0) {
                        suitableCombination.push(hotel);
                    }
                    nrOfPeople = nrOfPeople - _.min([nrOfPeople, hotelCapacity]);
                });
            }
        }
        return suitableCombination;
    },
    'api.sort_hotels_by_rooms_available': function (hotels) {
        let result = _.sortBy(hotels, (hotel) => {
            return hotel.group_rooms[0].num_rooms_available_at_this_price;
        });
        return result.reverse();
    }
});
