const Report = require('../models/Report');
const Car = require('../models/Car');

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.userId }).populate('carId');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReport = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.body.carId, userId: req.userId });
    if (!car) return res.status(404).json({ error: 'Pojazd nie istnieje lub nie należy do Ciebie' });
    
    const newReport = new Report({ ...req.body, userId: req.userId });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
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
        // Tylko właściciel pojazdu może odpowiedzieć
        const report = await Report.findOne({ _id: req.params.id, userId: req.userId }).populate('carId');
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
