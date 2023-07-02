import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Abir Choudhury',
      email: 'abirudaipur@gmail.com',
      password: bcrypt.hashSync('123456789'),
      isAdmin: true,
    },

    {
      name: 'Manash Choudhury',
      email: 'manash72@gmail.com',
      password: bcrypt.hashSync('123456789'),
      isAdmin: false,
    },
  ],

  products: [
    {
      // _id:'1',
      name: 'Nike-Shirt',
      type: 'Slim-Shirt',
      category: 'Shirts',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3xCL-ZuxwcmowIV6nsLiOsqByEMhkaFcWQ&usqp=CAU',
      price: 200,
      countInStock: 10,
      brand: 'Nike',
      rating: 3.3,
      numReviews: 30,
      description:
        'This T-Shirt of Nike Brand is super classy with slim outfit and comfortable for all occasions',
    },
    {
      // _id:'2',
      name: 'Adidas Long-TShirt',
      type: 'Slim-T-shirt',
      category: 'Shirts',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dbR4kA4cltVubGk6q1e3OWgib_GLwtQyN2KGbnct5EQwOpy9QKvlfrtS28kRdH9SLIE&usqp=CAU',
      price: 250,
      countInStock: 5,
      brand: 'Adidas',
      rating: 4.2,
      numReviews: 40,
      description:
        'This Long T-Shirt of Adidas Brand contains multiple colur combinations and designed in High Quality fabric',
    },
    {
      // _id:'3',
      name: 'Monte-Carlo Shirts',
      type: 'Full Sleeves',
      category: 'Shirts',
      image:
        'https://sslimages.shoppersstop.com/sys-master/images/h0c/h9c/26466234662942/S21182FSAGD1RB_ROYAL_BLUE_alt1.jpg_2000Wx3000H',
      price: 450,
      countInStock: 0,
      brand: 'Monte Carlo',
      rating: 3.5,
      numReviews: 100,
      description:
        'Monte Carlo Formal Shirts are well stiched ,purely made of cotton and are best suited to wear in any formal& jobs places.',
    },
  ],
};

export default data;
