import React from 'react';

export default function FirstComponent(props) {
  console.log("name:", props.name);
  console.log("age:", props.age);

  return (
    <div>
      <a href="#">
        This is Shahzaib's first component
      </a>
      <p>{props.name}</p>
    </div>
  );
}



