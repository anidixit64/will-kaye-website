import React, { useState } from 'react';
import '../styles/ContactForm.css';

function ContactForm({ contactEmail }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create mailto link with pre-filled content
      const subject = encodeURIComponent(`Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      
      const mailtoLink = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setSubmitStatus('success');
      
      // Reset form after a short delay
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="form-textarea"
            placeholder="Your message..."
            rows="4"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`form-submit ${isSubmitting ? 'submitting' : ''}`}
        >
          {isSubmitting ? 'Opening Email...' : 'Send Message'}
        </button>

        {submitStatus === 'success' && (
          <div className="form-status success">
            ✓ Email client opened! Please send your message.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="form-status error">
            ✗ Error opening email client. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}

export default ContactForm;
