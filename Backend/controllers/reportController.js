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

exports.getReportById = async (req, res) => {
  try {
    const query = req.userRole === 'mechanic' ? { _id: req.params.id } : { _id: req.params.id, userId: req.userId };
    const report = await Report.findOne(query).populate('carId');
    if (!report) return res.status(404).json({ error: 'Zgłoszenie nie znalezione' });
    res.json(report);
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
    // Klient może tylko zaakceptować lub odrzucić naprawę w statusie awaiting_approval
    if (req.userRole !== 'mechanic') {
      const report = await Report.findById(req.params.id);
      if (!report) return res.status(404).json({ error: 'Zgłoszenie nie znalezione' });

      const isOwner = report.userId === req.userId;
      const isAwaitingApproval = report.status === 'awaiting_approval';
      const allowedClientStatuses = ['in_progress', 'cancelled'];

      if (!isOwner || !isAwaitingApproval || !allowedClientStatuses.includes(req.body.status)) {
        return res.status(403).json({ error: 'Brak uprawnień do zmiany statusu' });
      }
    }

    const updateFields = { status: req.body.status };
    if (req.body.mechanicNotes !== undefined) {
      updateFields.mechanicNotes = req.body.mechanicNotes;
    }
    if (req.body.additionalIssues !== undefined) {
      updateFields.additionalIssues = req.body.additionalIssues;
    }
    if (req.body.scheduledDate !== undefined) {
      updateFields.scheduledDate = req.body.scheduledDate;
    }
    if (req.body.estimatedCost !== undefined) {
      updateFields.estimatedCost = req.body.estimatedCost;
    }
    if (req.body.finalCost !== undefined) {
      updateFields.finalCost = req.body.finalCost;
    }
    if (req.body.completedDate !== undefined) {
      updateFields.completedDate = req.body.completedDate;
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { returnDocument: 'after' }
    ).populate('carId');
    if (!report) return res.status(404).json({ error: 'Zgłoszenie nie znalezione' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    if (req.userRole !== 'mechanic') {
      return res.status(403).json({ error: 'Tylko mechanik może aktualizować szczegóły naprawy' });
    }

    const updateFields = {};
    if (req.body.mechanicNotes !== undefined) updateFields.mechanicNotes = req.body.mechanicNotes;
    if (req.body.additionalIssues !== undefined) updateFields.additionalIssues = req.body.additionalIssues;
    if (req.body.scheduledDate !== undefined) updateFields.scheduledDate = req.body.scheduledDate;
    if (req.body.estimatedCost !== undefined) updateFields.estimatedCost = req.body.estimatedCost;
    if (req.body.finalCost !== undefined) updateFields.finalCost = req.body.finalCost;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { returnDocument: 'after' }
    ).populate('carId');
    
    if (!report) return res.status(404).json({ error: 'Zgłoszenie nie znalezione' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const query = req.userRole === 'mechanic' ? { _id: req.params.id } : { _id: req.params.id, userId: req.userId };
    const report = await Report.findOne(query);
    
    if (!report) return res.status(404).json({ error: 'Zgłoszenie nie znalezione' });

    report.messages.push({
      senderId: req.userId,
      senderRole: req.userRole,
      content: req.body.content
    });

    await report.save();
    res.status(201).json(report.messages[report.messages.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
