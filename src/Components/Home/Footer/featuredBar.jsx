import { Globe, BadgePercent, Lock, Shirt } from 'lucide-react';

const features = [
  {
    icon: <Globe size={40} />,
    title: "Worldwide Shipping",
    desc: "It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
  {
    icon: <Shirt size={40} />,
    title: "Best Quality",
    desc: "It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
  {
    icon: <BadgePercent size={40} />,
    title: "Best Offers",
    desc: "It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
  {
    icon: <Lock size={40} />,
    title: "Secure Payments",
    desc: "It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
];

export default function FeatureBar() {
  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-center gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card text-center p-4 border-0 shadow-sm"
            style={{ width: "250px", minHeight: "220px" }}
          >
            <div className="mb-3 text-dark">{feature.icon}</div>
            <h5 className="card-title fw-semibold">{feature.title}</h5>
            <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
