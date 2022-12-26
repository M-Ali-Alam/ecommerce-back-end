import Room from "../models/Rooms.js";
import Hotel from "../models/Hotels.js";
import Users from "../models/Users.js";
import Reservations from "../models/Reservations.js";

export const createRoom = async (req,res,next) => {
    const hotelId = req.params.hotelId;
    const room = new Room({
        room_number: req.body.room_number,
        no_of_rooms: req.body.no_of_rooms,
        price: req.body.price,
        available_discount: req.body.available_discount,
        maxPeople: req.body.maxPeople,
        desc: req.body.desc,
        unavailableDates: req.body.unavailableDates,
        hotel_id: hotelId,
    })
    try {
        const savedRoom = await room.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: {rooms: savedRoom._id},
            },{new: true})
        } catch (error) {
            next(error);
        }
        res.status(200).json(savedRoom);
    } catch (error) {
        next(error);
    }
}

export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true});
        res.status(200).json(updatedRoom)
    } catch (error) {
        next(error);
    }
}

export const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId;
    try {
        await Room.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: {rooms: req.params.id},
            })
        } catch (error) {
            next(error);
        }
        res.status(200).json("Room has been deleted")
    } catch (error) {
        next(error);
    }
}

export const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        localStorage.setItem('room', room._id.toString());
        res.status(200).json(room)
    } catch (error) {
        next(error);
    }
}

export const getRooms = async (req, res, next) => {
    try {
        await Room.aggregate([{$match: {maxPeople: {$lte: req.body.maxPeople}}},
            {$project: {unavailableDates: {$filter: {
            "input": "$unavailableDates",
            "as": "index",
            "cond": {$or: [{$lte: ["$$index.to", new Date(req.query.start_date)]},{$gte: ["$$index.from", new Date(req.query.end_date)]}]}
        }},document: "$$ROOT"}}
    ]).then(rooms => res.status(200).json(rooms));
    } catch (error) {
        next(error);
    }
}

export const reserveRoom = async (req, res, next) => {
    const room_id = req.params.room_id
    try {
        const room = await Room.findById(room_id)
        const user = await Users.findById(req.user.id)

        try {
            const discount = parseInt(room.available_discount.split('%')[0])
            const cost = parseInt(room.price.split('$')[1])

            const reservation = new Reservations({
                user_id: user._id,
                room_id: room._id,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                cost: cost - discount,
                discount_amount: discount
            })
            const saved_reservation = await reservation.save()
            res.status(200).json(saved_reservation)
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}