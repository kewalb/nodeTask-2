const dotenv = require('dotenv')
const express = require("express");
const moment = require("moment");
const app = express();

dotenv.config()

//middleware
const PORT = process.env.PORT
app.use(express.json());

const rooms = [
  {
    roomId: 0,
    noOfSeats: "200",
    amenities: ["AC", "TV", "Hot-Water", "Wifi", "Lunch"],
    price: 5000,
    status: false,
    rName: "conference",
    customerDetails: {
      name: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  },
  {
    roomId: 1,
    noOfSeats: "10",
    amenities: ["AC", "TV", "Hot-Water", "Wifi"],
    price: 500,
    status: false,
    rName: "Family Room",
    customerDetails: {
      name: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  },
  {
    roomId: 2,
    noOfSeats: "50",
    amenities: ["AC", "Wifi", "Lunch", "Dinner"],
    price: 2300,
    status: false,
    rName: "Get-Together",
    customerDetails: {
      name: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  },
  {
    roomId: 3,
    noOfSeats: "150",
    amenities: ["AC", "Wifi", "Lunch"],
    price: 3000,
    status: true,
    rName: "Get-Together",
    customerDetails: {
      name: "Kewal",
      date: "22/02/2021",
      startTime: "07:00:00",
      endTime: "19:00:00",
    },
  },
];

app.get("/", (request, response) => {
  response.status(200).send("Welcome to Room Booking App");
});

app.post("/rooms/create", (request, response) => {
  const data = request.body;
  rooms.push(data);
  response
    .status(201)
    .send(`room created successfully with following details ${data}`);
});

app.get("/rooms", (request, response) => {
  response.status(200).send(
    rooms.map((room) => {
      if (room.status === true) {
        return {
          rName: room.rName,
          status: room.status,
          CustomerName: room.customerDetails.name,
          date: room.customerDetails.date,
          startTime: room.customerDetails.startTime,
          endTime: room.customerDetails.endTime,
        };
      } else {
        return { rName: room.rName, status: room.status };
      }
    })
  );
});

app.post("/rooms/book", (request, response) => {
  let data = request.body;
  // console.log(data)

  const room = rooms.map((room) => {
    if (room.roomId === data.roomId) {
      //extract the date
      const roomDate = moment(room.customerDetails.date, "DD/MM/YYYY");
      const bookedDate = moment(data.customerDetails.date, "DD/MM/YYYY");

      //extracting start time
      const roomStartTime = moment(room.customerDetails.startTime, "hh:mm:ss");
      const dataStartTime = moment(data.customerDetails.startTime, "hh:mm:ss");

      //extracting end time
      const roomEndTime = moment(room.customerDetails.endTime, "hh:mm:ss");
      const dataEndTime = moment(data.customerDetails.endTime, "hh:mm:ss");
      if (room.status) {
        if (bookedDate > roomDate) {
          // book the room with details
          room.customerDetails.date = data.customerDetails.date;
          room.customerDetails.startTime = data.customerDetails.startTime;
          room.customerDetails.endTime = data.customerDetails.endTime;
          room.customerDetails.name = data.customerDetails.name;
        } else if (bookedDate < roomDate) {
          response.status(400).send("Please give proper date");
        } else {
          if (
            dataStartTime.isBetween(roomStartTime, roomEndTime) ||
            dataEndTime.isBetween(roomStartTime, roomEndTime)
          ) {
            response.send("please select different time slot");
          } else {
            room.customerDetails.date = data.customerDetails.date;
            room.customerDetails.startTime = data.customerDetails.startTime;
            room.customerDetails.endTime = data.customerDetails.endTime;
            room.customerDetails.name = data.customerDetails.name;
            response.send(room);
          }
        }
      }
      // console.log(room)
      // response.send(data);
    }
  });
});

app.get("/customers", (request, response) => {
  const room = rooms.filter(room => room.status === true).map(x =>{return{
    "name":x.customerDetails.name,
    "roomName":x.rName,
    "date":x.customerDetails.date,
    "startTime":x.customerDetails.startTime,
    "endTime":x.customerDetails.endTime
  }})


console.log(room)
  response.send(room)
})

app.listen(PORT);
