import React from "react";
import Image from "next/image";
import background from "../../../public/bg.jpg";
import styles from "../../styles/BackgroundImage.module.scss";

export class BackgroundImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Image
          className={styles.cover_image}
          src={background}
          alt="picture of background"
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          objectPosition="cover"
        />
      </>
    );
  }
}
