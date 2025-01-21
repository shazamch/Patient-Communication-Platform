const MessageOptionsDropdown = ({ onMakeTaskClick, dropdownPosition = "left" }) => {
    return (
        <div
            className={`absolute ${
                dropdownPosition === "left" ? "left-0" : "right-0"
            } mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-20 z-25`}
        >
            <div
                onClick={() => {
                    onMakeTaskClick();
                }}
                className="p-1 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
            >
                Make Task
            </div>
        </div>
    );
};

export default MessageOptionsDropdown;
