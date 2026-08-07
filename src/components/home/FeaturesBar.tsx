export default function FeaturesBar() {
  const features = [
    { icon: '🚚', title: 'Fast Delivery', desc: 'Nationwide shipping' },
    { icon: '💳', title: 'Secure Payment', desc: 'Paystack protected' },
    { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
    { icon: '💬', title: '24/7 Support', desc: 'We\'re here to help' },
  ];

  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="container-main py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
