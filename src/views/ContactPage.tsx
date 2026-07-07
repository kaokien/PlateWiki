'use client';
import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { getBreadcrumbSchema } from '../utils/seoSchemas';
import './LegalPage.css';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on edit
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    // Validate on blur
    const validationErrors: Record<string, string> = validate() as Record<string, string>;
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = validate() as Record<string, string>;
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Build mailto link with form data since we don't have a backend yet
    const subject = encodeURIComponent(`PlateWiki Contact: ${formData.name}`);
    const body = encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`);
    window.location.href = `mailto:contact@PlateWiki.org?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const fieldClass = (name: string) => {
    if (errors[name] && touched[name]) return 'field-error';
    if (touched[name] && !errors[name] && formData[name as keyof typeof formData]) return 'field-valid';
    return '';
  };

  return (
    <div className="legal-page">
<h1>Contact <span className="text-primary">Us</span></h1>

      <div className="glass-panel legal-content">
        <p>
          Feedback, technique requests, or partnership ideas — send it.
        </p>

        {submitted ? (
          <div className="success-message" role="status" aria-live="polite">
            <CheckCircle size={32} style={{ marginBottom: '0.5rem' }} />
            <h3>Opening your email client</h3>
            <p>Got it. If your email client didn't open, reach us at <a href="mailto:contact@PlateWiki.org">contact@PlateWiki.org</a>.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className={`form-group ${fieldClass('name')}`}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Your name"
                aria-describedby={errors.name ? 'name-error' : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && touched.name && (
                <span className="field-error-msg" id="name-error" role="alert">{errors.name}</span>
              )}
            </div>
            <div className={`form-group ${fieldClass('email')}`}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="your@email.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && touched.email && (
                <span className="field-error-msg" id="email-error" role="alert">{errors.email}</span>
              )}
            </div>
            <div className={`form-group ${fieldClass('message')}`}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Your message..."
                aria-describedby={errors.message ? 'message-error' : undefined}
                aria-invalid={!!errors.message}
              />
              {errors.message && touched.message && (
                <span className="field-error-msg" id="message-error" role="alert">{errors.message}</span>
              )}
            </div>
            <button type="submit" className="submit-btn">
              <Send size={18} /> Send Message
            </button>
          </form>
        )}

        <h2>Featured Creator</h2>
        <p>
          For personal training, private coaching, or content collaboration with Coach Josh, 
          visit <a href="https://coachjoshofficial.com" target="_blank" rel="noopener noreferrer">coachjoshofficial.com</a>.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
