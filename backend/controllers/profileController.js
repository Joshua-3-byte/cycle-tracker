import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile controller', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, dateOfBirth, avgCycleLength, avgPeriodLength, emailReminders, reminderDaysBefore } = req.body;

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (avgCycleLength) user.avgCycleLength = avgCycleLength;
    if (avgPeriodLength) user.avgPeriodLength = avgPeriodLength;
    if (emailReminders !== undefined) user.emailReminders = emailReminders;
    if (reminderDaysBefore) user.reminderDaysBefore = reminderDaysBefore;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      dateOfBirth: updatedUser.dateOfBirth,
      avgCycleLength: updatedUser.avgCycleLength,
      avgPeriodLength: updatedUser.avgPeriodLength,
      emailReminders: updatedUser.emailReminders,
      reminderDaysBefore: updatedUser.reminderDaysBefore,
    });
  } catch (error) {
    console.error('Error in updateProfile controller', error);
    res.status(500).json({ message: error.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in updatePassword controller', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAccount controller', error);
    res.status(500).json({ message: error.message });
  }
};