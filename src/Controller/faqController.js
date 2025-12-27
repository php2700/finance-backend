import Faq from '../Models/faqModel.js';

/* ================= CREATE FAQ ================= */
export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body || {};

    if (!question || !answer) {
      return res.status(400).json({
        message: 'Question and answer are required',
      });
    }

    const faq = await Faq.create({
      question,
      answer,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      message: 'FAQ created successfully',
      faq,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL FAQ ================= */
export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    // .limit(20) // pagination optional

    res.status(200).json({ faqs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SINGLE FAQ ================= */
export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    res.status(200).json({ faq });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE FAQ ================= */
export const updateFaq = async (req, res) => {
  try {
    const { question, answer, status } = req.body || {};
    const faq = await Faq.findById(req.params.id);

    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (status !== undefined) faq.status = status;

    await faq.save();

    res.status(200).json({
      message: 'FAQ updated successfully',
      faq,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE FAQ ================= */
export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    await faq.deleteOne();

    res.status(200).json({
      message: 'FAQ deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
