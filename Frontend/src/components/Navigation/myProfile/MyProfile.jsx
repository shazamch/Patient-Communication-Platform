import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../../elements/customInput/CustomInput";
import ButtonWithIcon from "../../../elements/buttonWithIcon/ButtonWithIcon.jsx";
import { useDispatch, useSelector } from "react-redux";
import PasswordInput from "../../../elements/passwordInput/PasswordInput.jsx";
import CrossButton from "../../../elements/crossButton/CrossButton.jsx";
import { updateUser } from "../../../redux/actions/userAction.js";

export default function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [selectedImage, setSelectedImage] = useState(
    Array.isArray(user.profilephoto)
      ? user.profilephoto
      : [user.profilephoto]
  );
  // Initialize state to store admin data, including timezone
  const [adminData, setAdminData] = useState({
    _id: "",
    name: "",
    password: "",
    role: "Admin",
    phone: "",
    email: "",
    address: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
    },
    gender: "Male",
  });
  const [currentPassword, setcurrentPassword] = useState();
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setAdminData(user);
  }, []);

  const handleImageChange = (e) => {
    const file = Array.from(e.target.files); // Convert FileList to an array
    setSelectedImage(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value.replace(/\D/g, "");

    if (formattedValue.length <= 3) {
      formattedValue = `${formattedValue}`;
    } else if (formattedValue.length <= 6) {
      formattedValue = `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(
        3
      )}`;
    } else if (formattedValue.length <= 10) {
      formattedValue = `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(
        3,
        6
      )}-${formattedValue.slice(6)}`;
    } else if (formattedValue.length >= 10) {
      formattedValue = formattedValue.slice(0, 10);
      formattedValue = `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(
        3,
        6
      )}-${formattedValue.slice(6)}`;
    }

    // Update the specific phone field based on the input's name attribute
    setAdminData((prevData) => ({
      ...prevData,
      [name]: formattedValue, // Dynamically update the field specified by the name
    }));
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("Address.")) {
      const addressField = name.split(".")[1]; // Extract the field name (e.g., street, city, etc.)
      setAdminData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value, // Update the specific subfield within Address
        },
      }));
    } else {
      setAdminData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = passwordData;

    // Validate new password length and match
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (confirmPassword.length === 0) {
      setPasswordError("Enter comfirm password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    } else {
      try {
        // const response = await dispatch(
        //   umsMiddleware.changeUserPassword(
        //     currentPassword,
        //     passwordData.newPassword
        //   )
        // );
        console.log("Password changed successfully");
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setPasswordError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();

    formData.append("Role", adminData.role);
    formData.append("Phone", adminData.phone);
    formData.append("Name", adminData.name);

    formData.append("Email", adminData.email);
    formData.append("Address", JSON.stringify(adminData.address));
    formData.append("Gender", adminData.gender);
    formData.append("Timezone", adminData.Timezone);
    formData.append("adminID", adminData._id);

    // Append selected images if any
    if (selectedImage.length > 0) {
      for (const file of selectedImage) {
        formData.append("DishPhoto", file);
      }
    }

    try {
      const response = await dispatch(
        umsMiddleware.UpdateAdmin(adminData._id, formData)
      );
      if (response.success) {
        dispatch(updateUser(response.data));
        // navigate('/profile'); // Redirect after success
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="p-5 rounded-2xl overflow-y-auto h-[calc(100vh-120px)] ">
      <div className="font-['Poppins', sans-serif]">
        <div className="flex justify-between mb-[15px]">
          <h1 className="text-[#959595] font-bold text-2xl">My Profile</h1>
          <CrossButton
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          />
        </div>
        <form onSubmit={handleSubmit}>
          {/* User Information */}
          <div className="flex flex-col mb-4">
            <h2 className="text-lg font-bold">{user?.Name}</h2>
            <p className="text-gray-500">{user?.Email}</p>
          </div>

          {/* Input Fields */}
          <div className="flex flex-wrap gap-[10px] mb-[15px] w-full ">
            <div className="flex-1 min-w-[1px]">
              <label htmlFor="Name" className="block font-bold ">
                Name
              </label>
              <CustomInput
                id="Name"
                name="Name"
                value={adminData.name}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="flex-1 min-w-[1px]">
              <label htmlFor="Phone" className="block font-bold ">
                Phone
              </label>
              <CustomInput
                id="Phone"
                name="Phone"
                type="tel"
                value={adminData.phone}
                onChange={handlePhoneChange}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-[10px] mb-[15px] w-full ">
            <div className="flex-1 min-w-[1px]">
              <label htmlFor="Email" className="block font-bold ">
                Email
              </label>
              <CustomInput
                id="Email"
                name="Email"
                value={adminData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="flex-1 min-w-[1px]">
              <label htmlFor="Gender" className="block font-bold">
                Gender
              </label>
              <select
                id="Gender"
                name="Gender"
                value={adminData.gender || "Select"} // Default to "Select" when Gender is not yet selected
                onChange={handleInputChange}
                className="px-1.5 py-1.5 border border-gray-300 rounded-md text-sm w-full bg-gray-100"
                required
              >
                <option value="Select" disabled>
                  Select
                </option>{" "}
                {/* 'Select' is a placeholder */}
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* <div className="w-full  mb-4">
            <p className="mb-2 font-semibold">Profile image</p>

            <div className="flex">
              <div className="relative inline-block border border-gray-300 rounded-md p-1 ">
                <input
                  type="file"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="absolute inset-0 opacity-0 py-1"
                />
                <span className="text-gray-700">Choose Files</span>
              </div>

              <span className="text-gray-700 flex items-center ml-2">
                {selectedImage?.length > 0
                  ? selectedImage?.map((image) => {
                      const fileName =
                        typeof image === "string"
                          ? image
                              .split("/")
                              .pop()
                              .replace(
                                /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}-/,
                                ""
                              ) // Remove timestamp
                          : image.name;
                      return <span key={fileName}>{fileName}</span>;
                    })
                  : "No file selected"}
                {selectedImage?.length > 0 && (
                  <CrossButton
                    className="w-8 h-8"
                    onClick={() => handleRemoveImage()}
                  />
                )}
              </span>
            </div>
          </div> */}

          {/* <div className="mb-4 ">
                        <label htmlFor="Address" className="block font-bold ">Address *</label>
                        <textarea
                            id="Address"
                            name="Address"
                            value={adminData.Address}
                            onChange={handleInputChange}
                            className="p-3 border border-gray-300 rounded-md text-sm w-full"
                            required
                            rows="4" // You can adjust the height with rows and cols
                        ></textarea>
                    </div> */}
          <h2 className="text-[#959595] mb-[15px] font-bold text-lg">
            Address
          </h2>
          <div className="flex flex-wrap gap-[10px] mb-[15px] w-full">
            <div className="flex-1 min-w-[1px]">
              <label htmlFor="street1" className="block font-bold ">
                Street Line1
              </label>
              <CustomInput
                id="street1"
                name="Address.street1"
                value={adminData.address.street1}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="flex-1 min-w-[1px]">
              <label htmlFor="street2" className="block font-bold ">
                Street Line2
              </label>
              <CustomInput
                id="street2"
                name="Address.street2"
                value={adminData.address.street2}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-[10px] mb-[15px] w-full">
            <div className="flex-1 min-w-[1px]">
              <label htmlFor="city" className="block font-bold ">
                City
              </label>
              <CustomInput
                id="city"
                name="Address.city"
                value={adminData.address.city}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="flex-1 min-w-[1px]">
              <label htmlFor="state" className="block font-bold ">
                State
              </label>
              <CustomInput
                id="state"
                name="Address.state"
                value={adminData.address.state}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="flex-1 min-w-[1px]">
              <label htmlFor="zipcode" className="block font-bold ">
                Zipcode
              </label>
              <CustomInput
                id="zipcode"
                name="Address.zipcode"
                value={adminData.address.zipcode}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            {/* <div className="flex-1 min-w-[1px]">
              <label htmlFor="country" className="block font-bold ">
                Country
              </label>
              <CustomInput
                id="country"
                name="Address.country"
                value={adminData.Address.country}
                onChange={handleInputChange}
                className="w-full"
              />
            </div> */}
          </div>

          {/* Timezone Selection */}
          {/* <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Select Timezone</label>
                        <TimezoneSelect onChange={handleTimezoneChange} />
                    </div> */}

          {/* Password Change Section */}

          <h2 className="text-[#959595] mb-[15px] font-bold text-2xl mt-6">
            Change Password
          </h2>
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setcurrentPassword(e.target.value)}
            className="mb-[15px] py-1"
            // label="Current Password *"
            label={
              <>
                Current Password <span className="text-red-600">*</span>
              </>
            }

            // required
          />

          <div className="flex gap-[10px] mb-[15px] w-full">
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              // label="New Password *"
              className="mb-[15px] py-1"
              label={
                <>
                  New Password <span className="text-red-600">*</span>
                </>
              }
              error={passwordError}
            />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="mb-[15px] py-1"
              // label="Confirm New Password *"
              label={
                <>
                  Confirm New Password <span className="text-red-600">*</span>
                </>
              }
              // required
              // error={passwordMatchError}
            />
          </div>

          <div className="flex justify-center mt-4">
            <ButtonWithIcon
              type="button"
              onClick={handlePasswordSubmit}
              text="Change Password"
              className="bg-green-700 text-white px-3 py-2 rounded-full"
            />
          </div>

          <div className="flex justify-center gap-2 mt-7">
            <ButtonWithIcon
              type="button"
              onClick={handleCancel}
              text="Discard"
              className="bg-red-600 text-white px-3 py-2 min-w-[100px] rounded-full"
            />
            <ButtonWithIcon
              type="submit"
              text="Save"
              className="bg-blue-600 text-white px-3 py-2 min-w-[100px] rounded-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
