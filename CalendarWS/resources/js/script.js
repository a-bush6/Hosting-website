// Array to store events
let events = [];

// Track which event is being edited (-1 means creating new)
let editIndex = -1;

// saveEvent function - called when Save Event button is clicked
function saveEvent() {
    const eventForm = document.getElementById('event_form');

    // Check if form is valid (uses HTML5 required validation)
    if (!eventForm.checkValidity()) {
        // Show validation messages
        eventForm.reportValidity();
        return; // Stop if form is invalid
    }

    // Read values from the form using getElementById
    let eventName = document.getElementById('event_name').value;
    let eventCategory = document.getElementById('event_category').value;
    let weekday = document.getElementById('event_weekday').value;
    let time = document.getElementById('event_time').value;
    let modality = document.getElementById('event_modality').value;
    let location = document.getElementById('event_location').value;
    let remoteUrl = document.getElementById('event_remote_url').value;
    let attendees = document.getElementById('event_attendees').value;

    // Create event object
    let eventObj = {
        name: eventName,
        category: eventCategory,
        weekday: weekday,
        time: time,
        modality: modality,
        location: location,
        remoteUrl: remoteUrl,
        attendees: attendees
    };

    if (editIndex === -1) {
        // Creating a new event
        events.push(eventObj);
        addEventToCalendarUI(eventObj);
    } else {
        // Updating an existing event

        // Remove old card from the old day column
        let oldEvent = events[editIndex];
        let oldDayColumn = document.getElementById(oldEvent.weekday);
        // Find the card by its data-index attribute
        let oldCard = oldDayColumn.querySelector(`[data-index="${editIndex}"]`);
        if (oldCard) {
            oldCard.remove();
        }

        // Update event in array
        events[editIndex] = eventObj;

        // Add updated card to calendar
        addEventToCalendarUI(eventObj, editIndex);

        // Reset editIndex
        editIndex = -1;
    }

    // Log to console (for testing)
    console.log('Event saved:', eventObj);
    console.log('All events:', events);

    // Reset form
    eventForm.reset();

    // Close modal
    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();
}

// Function to open modal with event data for editing
function editEvent(index) {
    let eventDetails = events[index];
    editIndex = index;

    // Pre-fill form fields
    document.getElementById('event_name').value = eventDetails.name;
    document.getElementById('event_category').value = eventDetails.category;
    document.getElementById('event_weekday').value = eventDetails.weekday;
    document.getElementById('event_time').value = eventDetails.time;
    document.getElementById('event_modality').value = eventDetails.modality;
    document.getElementById('event_location').value = eventDetails.location || '';
    document.getElementById('event_remote_url').value = eventDetails.remoteUrl || '';
    document.getElementById('event_attendees').value = eventDetails.attendees || '';

    // Update location field visibility based on modality
    updateLocationOptions(eventDetails.modality);

    // Update modal title
    document.getElementById('event_modal_label').textContent = 'Edit Event';

    // Open the modal
    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.show();
}

// Function to create an event card element
function createEventCard(eventDetails, index) {
    // Create main div
    let event_element = document.createElement('div');

    // Set background color based on category
    let bgColor = '';
    if (eventDetails.category === 'work') {
        bgColor = 'bg-primary';       // blue
    } else if (eventDetails.category === 'personal') {
        bgColor = 'bg-secondary';     // gray
    } else if (eventDetails.category === 'Academic') {
        bgColor = 'bg-success';       // green
    } else if (eventDetails.category === 'other') {
        bgColor = 'bg-danger';        // red
    }

    event_element.classList = `event row border rounded m-1 py-1 ${bgColor} text-white`;
    event_element.setAttribute('data-index', index);
    event_element.style.cursor = 'pointer';

    // Click event to edit
    event_element.addEventListener('click', function () {
        editEvent(index);
    });

    // Create info div
    let info = document.createElement('div');
    info.innerHTML = `
        <strong>${eventDetails.name}</strong><br>
        <small>${eventDetails.time}</small><br>
        <small>${eventDetails.modality}</small>
    `;

    // Append info to event element
    event_element.appendChild(info);

    return event_element;
}

// Function to add event to calendar UI
function addEventToCalendarUI(eventInfo, index) {
    // Use provided index or calculate from array length
    let eventIndex = (index !== undefined) ? index : events.length - 1;

    // Create the event card
    let event_card = createEventCard(eventInfo, eventIndex);

    // Find the correct day column using weekday
    const dayColumn = document.getElementById(eventInfo.weekday);

    // Append event card to the day column
    if (dayColumn) {
        dayColumn.appendChild(event_card);
    }
}

// Function to show/hide location fields based on modality
function updateLocationOptions(modality) {
    const locationField = document.getElementById('event_location').parentElement;
    const remoteUrlField = document.getElementById('event_remote_url').parentElement;

    if (modality === 'in-person') {
        // Show location and hides remote URL
        locationField.style.display = 'block';
        remoteUrlField.style.display = 'none';
    } else if (modality === 'remote') {
        // Hide location and shows remote URL
        locationField.style.display = 'none';
        remoteUrlField.style.display = 'block';
    } else if (modality === 'hybrid') {
        // Show both remote and location
        locationField.style.display = 'block';
        remoteUrlField.style.display = 'block';
    } else {
        // Default: show both remote and location
        locationField.style.display = 'block';
        remoteUrlField.style.display = 'block';
    }
}

// Reset modal to "Create" mode when opening for new event
document.addEventListener('DOMContentLoaded', function () {
    const modalElement = document.getElementById('event_modal');
    modalElement.addEventListener('hidden.bs.modal', function () {
        // Reset to create mode when modal closes
        editIndex = -1;
        document.getElementById('event_modal_label').textContent = 'Create Event';
        document.getElementById('event_form').reset();
    });
});
