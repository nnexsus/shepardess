import Settings from "./settings";
import Contact from "./contact";
import Past from "./past";
import Poll from "./poll";
import Warn from "./warn";
import Map from "./map";

const panels = {
    "map": Map,
    "past": Past,
    "social": Poll,
    "warn": Warn,
    "contact": Contact,
    "settings": Settings
}

export default panels;