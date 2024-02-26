import Filter from "badwords-filter";
import badwords from "./badwords";

const config = {
    list: badwords,
};
const filter = new Filter(config);

export function isValidUser(input) {
    const name = input.toLowerCase().trim();
    if (name === "") {
        return {
            status: false,
            message: "Please enter a username.",
        };
    }
    if (filter.isUnclean(name)) {
        return {
            status: false,
            message: "Don't be naughty. Choose another username.",
        };
    }

    return {
        status: true,
    };
}
