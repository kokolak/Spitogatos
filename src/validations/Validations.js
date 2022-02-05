

export const validation = (obj) => {
    const list = [];

    if (obj.price < 50 || obj.price > 5000000) {
        list.push({
            name: 'price',
            msg: "price must be between 50 and 5000000"
        })
    }

    if (obj.area < 20 || obj.area > 1000) {
        list.push({
            name: "area",
            msg: "area must be between 20 and 1000"
        })

    }

    return list;

}