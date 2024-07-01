import ChatPanel from "../chat/chatpanel";
import Settings from "./settings";
import Contact from "./contact";
import Social from "./social";
import Past from "./past";
import Warn from "./warn";
import Map from "./map";

const panels = {
    "map": Map,
    "past": Past,
    "social": Social,
    "warn": Warn,
    "contact": Contact,
    "settings": Settings,
    "chat": ChatPanel
}

export default panels;