import User from "../models/User.js";

export const getPendingOwners = async (req, res) => {
  const owners = await User.find({ role: "owner", isApproved: false });
  res.json(owners);
};

// export const approveOwner = async (req, res) => {
//   const { ownerId } = req.params;

//   await User.findByIdAndUpdate(ownerId, { isApproved: true });

//   res.json({ success: true, message: "Owner approved" });
// };
export const approveOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await User.findById(ownerId);

    if (!owner || owner.role !== "owner") {
      return res.status(404).json({ message: "Owner not found" });
    }

    owner.isApproved = true;
    await owner.save();

    res.json({ success: true, message: "Owner approved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
