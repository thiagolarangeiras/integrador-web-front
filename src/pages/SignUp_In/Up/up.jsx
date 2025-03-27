import './style.css';

function Up() {
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>User Registration</h1>
        
        <form>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              placeholder="Enter full name" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              placeholder="Enter email" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username" 
              type="text" 
              placeholder="Choose a username" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              placeholder="Create password" 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" required>
                <option value="">Select role</option>
                <option value="admin">Administrator</option>
                <option value="operator">Operator</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Up;