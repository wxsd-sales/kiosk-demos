import Single from './single.svg'
import Double from './double.svg'
import Americano  from './americano.svg'
import Flatwhite from './flatwhite.svg'
import Cappuccino from './cappuccino.svg'
import Latte from './latte.svg' 

export {
    Single,
    Double,
    Americano,
    Flatwhite,
    Cappuccino,
    Latte
  };

export const Milks = ['Regular', 'Skimmed', 'Coconut', 'Oat', 'Soya'];

export const Coffees = [
    { name: 'Espresso', image: Single, milk: false },
    { name: 'Double Espresso', image: Double, milk: false },
    { name: 'Americano', image: Americano, milk: false },
    { name: 'Flatwhite', image: Flatwhite, milk: false },
    { name: 'Cappuccino', image: Cappuccino, milk: true },
    { name: 'Latte', image: Latte, milk: true }
];