const {getCoupons} = require('./database')
const extraDiscount = 0.05
const extraPriceAllowedForDiscount = 2000
const discountTemplate = [
{
    itemCategory: 'Medicine',
    taxPercent: 0.05,
    minAmount: 0,
    maxAmount : Infinity

},

{
    itemCategory: 'Food',
    taxPercent: 0.05,
    minAmount: 0,
    maxAmount: Infinity
},

{
    itemCategory: 'Clothes',
    taxPercent: 0.05,
    minAmount: 0,
    maxAmount: 1000

},
{
    itemCategory: 'Clothes',
    taxPercent: 0.12,
    minAmount: 1001,
    maxAmount: Infinity

},
{
    itemCategory: 'Music',
    taxPercent: 0.03,
    minAmount: 0,
    maxAmount: Infinity

},
{
    itemCategory: 'Imported',
    taxPercent: 0.18,
    minAmount: 0,
    maxAmount: Infinity

}

]


const calculateDiscount = async (items) => {
    // items = JSON.parse(items)
    let finalRecipt = []
    let totalPrice = 0
    let totalTax = 0
    
    let allcoupons  = await getCoupons()



    items.forEach(si => {
        discountTemplate.forEach(dt =>{
            if(si.itemCategory === dt.itemCategory && si.price <= dt.maxAmount && si.price >= dt.minAmount){
                finalRecipt.push({
                    item : si.item,
                    itemCategory: si.itemCategory,
                    finalPrice : si.price + (si.price * dt.taxPercent),
                    taxApplied: si.price * dt.taxPercent
                })

                totalPrice +=si.price + (si.price * dt.taxPercent)
                totalTax += si.price * dt.taxPercent
            }
        })

    });
    if(totalPrice > extraPriceAllowedForDiscount) totalPrice = totalPrice - (totalPrice * extraDiscount)

        let coupon = allcoupons.find(ac => ac.couponExemptedVal <= totalPrice)
        totalPrice -= coupon.value

    
    return {
        totalPrice,
        totalTax
    }
}

console.log(calculateDiscount([{
    "item": "Headache pills",
    "itemCategory": "Medicine",
    "quantity": 5,
    "price": 50
},
{
    "item": "Sandwich",
    "itemCategory": "Food",
    "quantity": 2,
    "price": 200
},
{
    "item": "Perfume",
    "itemCategory": "Imported",
    "quantity": 1,
    "price": 4000
},
{
    "item": "Black Swan",
    "itemCategory": "Book",
    "quantity": 1,
    "price": 300
}
]))