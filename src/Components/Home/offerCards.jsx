import { Link } from "react-router-dom";

const cards = [
  {
    title: "20% Off On Tank Tops",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac dictum.",
    button: "SHOP NOW",
    image: "/images/tops.png",
    link: "/collection",
  },
  {
    title: "Latest Eyewear For You",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac dictum.",
    button: "SHOP NOW",
    image: "/images/eye-wear.JPG ",
    link: "/collection",
  },
  {
    title: "Let's Lorem Suit Up!",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac dictum.",
    button: "CHECK OUT",
    image: "/images/shoes.jpg",
    link: "/cart",
  },
];

export default function OfferCards() {
  return (
    <div className="container my-5">
      <div className="row">
        {cards.map((card, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div
              className="card text-white border-0 shadow"
              style={{
                backgroundImage: `url(${card.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "400px",
                position: "relative",
              }}
            >
              <div
                className="card-img-overlay d-flex flex-column justify-content-end"
                style={{ background: "rgba(0, 0, 0, 0.4)" }}
              >
                <h5 className="card-title fw-bold">{card.title}</h5>
                <p className="card-text">{card.description}</p>
                <Link to={card.link} className="btn btn-light w-fit text-dark fw-semibold mt-2" style={{ width: "fit-content" }}>
                  {card.button}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
