const Car = require('../models/Car');

exports.getCars = async (req, res) => {
  try {
    const query = req.userRole === 'mechanic' ? {} : { userId: req.userId };
    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCar = async (req, res) => {
  try {
    const newCar = new Car({ ...req.body, userId: req.userId });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const query = req.userRole === 'mechanic' ? { _id: req.params.id } : { _id: req.params.id, userId: req.userId };
    const car = await Car.findOneAndUpdate(
      query,
      req.body,
      { returnDocument: 'after' }
    );
    if (!car) return res.status(404).json({ error: 'Nie znaleziono pojazdu lub brak uprawnień' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const query = req.userRole === 'mechanic' ? { _id: req.params.id } : { _id: req.params.id, userId: req.userId };
    const car = await Car.findOneAndDelete(query);
    if (!car) return res.status(404).json({ error: 'Nie znaleziono pojazdu lub brak uprawnień' });
    res.json({ message: 'Pojazd usunięty pomyślnie' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
