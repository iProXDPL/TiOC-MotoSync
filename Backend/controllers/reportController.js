const Report = require('../models/Report');
const Car = require('../models/Car');

exports.getReports = async (req, res) => {
  try {
    const query = req.userRole === 'mechanic' ? {} : { userId: req.userId };
    const reports = await Report.find(query).populate('carId');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReport = async (req, res) => {
  try {
    const carQuery = req.userRole === 'mechanic' ? { _id: req.body.carId } : { _id: req.body.carId, userId: req.userId };
    const car = await Car.findOne(carQuery);
    if (!car) return res.status(404).json({ error: 'Pojazd nie istnieje lub brak uprawnień' });
    
    // Zawsze przypisujemy raport do właściciela pojazdu!
    const newReport = new Report({ ...req.body, userId: car.userId });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.userRole !== 'mechanic') {
      return res.status(403).json({ error: 'Tylko mechanik może aktualizować statusy naprawy' });
    }

    const updateFields = { status: req.body.status };
    if (req.body.mechanicNotes !== undefined) {
      updateFields.mechanicNotes = req.body.mechanicNotes;
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('carId');
    if (!report) return res.status(404).json({ error: 'Zgłoszenie nie znalezione' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addAdditionalIssue = async (req, res) => {
    try {
        if (req.userRole !== 'mechanic') {
            return res.status(403).json({ error: 'Tylko mechanik może dodawać dodatkowe wyceny usterek' });
        }
        
        const report = await Report.findById(req.params.id).populate('carId');
        if(!report) return res.status(404).json({ error: 'Zgłoszenie nie znalezione' });
        
        report.additionalIssues.push({
            description: req.body.description,
            estimatedCost: req.body.estimatedCost
        });
        report.status = 'Oczekuje na akceptację';
        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.respondToIssue = async (req, res) => {
    try {
        // Tylko właściciel pojazdu może odpowiedzieć (mechanik może pomóc testowo)
        const query = req.userRole === 'mechanic' ? { _id: req.params.id } : { _id: req.params.id, userId: req.userId };
        const report = await Report.findOne(query).populate('carId');
        if(!report) return res.status(404).json({ error: 'Zgłoszenie nie znalezione lub brak uprawnień' });

        const issue = report.additionalIssues.id(req.params.issueId);
        if(!issue) return res.status(404).json({ error: 'Dodatkowa wada nie znaleziona' });

        issue.isAccepted = req.body.isAccepted; // boolean z body np {"isAccepted": true}
        
        // Dodaj do kosztu jeśli zaakceptowane
        if(issue.isAccepted) {
            report.totalCost += issue.estimatedCost;
        }

        // Sprawdź czy wszystkie issues zostały już zdefiniowane
        const allResolved = report.additionalIssues.every(i => i.isAccepted !== null);
        if(allResolved) {
            report.status = 'W trakcie';
        }

        await report.save();
        res.json(report);
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
};
