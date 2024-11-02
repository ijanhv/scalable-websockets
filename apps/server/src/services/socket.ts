import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "localhost",
  port: 6379,
  password: "supersecretpassword",
});
const sub = new Redis({
  host: "localhost",
  port: 6379,
  password: "supersecretpassword",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service....");
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners");
    io.on("connect", (socket) => {
      console.log("New Socket connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", message);

        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      console.log("messages channel ");
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;

// import { Server } from "socket.io";
// import Redis from "ioredis"

// const pub = new Redis({
//     host: "localhost",
//     port: 6379,
//     password: "supersecretpassword"
// });
// const sub = new Redis({
//     host: "localhost",
//     port: 6379,
//     password: "supersecretpassword"
// });

// class SocketService {
//     private _io: Server;

//     constructor() {
//       console.log("Init Socket Service...");
//       this._io = new Server({
//         cors: {
//           allowedHeaders: ["*"],
//           origin: "*",
//         },
//       });
//       sub.subscribe("MESSAGES");
//     }

//     public initListeners() {
//       const io = this.io;
//       console.log("Init Socket Listeners...");

//       io.on("connect", (socket) => {
//         console.log(`New Socket Connected`, socket.id);
//         socket.on("event:message", async ({ message }: { message: string }) => {
//           console.log("New Message Rec.", message);
//           // publish this message to redis
//           await pub.publish("MESSAGES", JSON.stringify({ message }));
//         });
//       });

//       sub.on("message", async (channel, message) => {
//         if (channel === "MESSAGES") {
//           console.log("new message from redis", message);
//           io.emit("message", message);
//         }
//       });
//     }

//     get io() {
//       return this._io;
//     }
//   }

//   export default SocketService;
