

import { v4 as uuidv4 } from 'uuid';

export function Dateformatter(dateString){

    // Define the date string

    // const dateString = '2024-09-18T19:36:55.417Z';
    
    // Create a Date object from the string

    const date = new Date(dateString);

    // Define options for formatting the date and time
    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    
    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    
    // Format the date and time
    const formattedDate = date.toLocaleDateString('en-GB', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
    
    // Combine both parts
    const finalOutput = `${formattedTime} ${formattedDate}`;

    return finalOutput; // Return the formatted date and time


}


export function formateDate(date){

    if(date){
      return new Date(date).toISOString().split('T')[0];
    }
    return '';
  }


// Generate a UUID and trim it to a specific length

export const randomStringGenerator = (length) => {

  return uuidv4().replace(/-/g, '').slice(0, length);

};


export function isValidEmail(text) {
  const emailPattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(text);
}

