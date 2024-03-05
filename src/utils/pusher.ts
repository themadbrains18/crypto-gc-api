import Pusher from "pusher";

const pusher = new Pusher({
    appId: "1764567",
    key: "b275b2f9e51725c09934",
    secret: "623efdee5de58f6287ef",
    cluster: "ap2",
    useTLS: true
  });

export default pusher;  