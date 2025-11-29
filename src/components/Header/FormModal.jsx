export const FormModal = ({ setShowFormModal }) => {
  return (
    <div class="modal-overlay-form">
      <div class="form-container">
        <button class="close-btn-form" type="button" onClick={() => setShowFormModal(false)}>
          ✕
        </button>

        <form class="contact-form">
          <div class="form-group">
            <input
              type="text"
              class="form-input"
              placeholder="Full name*"
              required
            />
          </div>

          <div class="form-group">
            <input
              type="email"
              class="form-input"
              placeholder="Email Address*"
              required
            />
          </div>

          <div class="form-group">
            <input type="text" class="form-input" placeholder="Address" />
          </div>

          <div class="form-group">
            <input type="tel" class="form-input" placeholder="Phone Number" />
          </div>

          <div class="form-group">
            <textarea
              class="form-textarea"
              placeholder="How can we help?"
            ></textarea>
          </div>

          <button type="submit" class="submit-btn">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};
