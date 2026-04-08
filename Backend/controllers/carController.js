const Car = require('../models/Car');

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.userId });
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
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!car) return res.status(404).json({ error: 'Nie znaleziono pojazdu lub brak uprawnień' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!car) return res.status(404).json({ error: 'Nie znaleziono pojazdu lub brak uprawnień' });
    res.json({ message: 'Pojazd usunięty pomyślnie' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
