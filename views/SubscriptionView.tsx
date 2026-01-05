
import React from 'react';

const SubscriptionView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-2 rounded-full text-blue-600 font-black text-sm uppercase tracking-widest mb-6">
        <i className="fa-solid fa-crown"></i> Letago Premium
      </div>
      <h2 className="text-5xl font-black text-gray-800 mb-6 leading-tight">Elevate Your Letago <br/> Experience</h2>
      <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-16 font-medium">Support your favorite creators, unlock exclusive badges, and access advanced AI capabilities.</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: 'Supporter', price: 'Free', color: 'bg-white', text: 'text-gray-600', features: ['Ad-lite experience', 'Basic AI insights', 'Profile badges'] },
          { name: 'Creator Pro', price: '$9.99', color: 'bg-blue-600', text: 'text-white', featured: true, features: ['Zero ads', 'Full AI Captioning', 'Analytics Dashboard', 'Priority Support'] },
          { name: 'Influencer', price: '$24.99', color: 'bg-gray-900', text: 'text-white', features: ['Custom Branded Profile', 'Verified Gold Badge', 'Early API Access', 'Exclusive Events'] }
        ].map((plan, i) => (
          <div key={i} className={`p-10 rounded-[40px] shadow-2xl transition-transform hover:-translate-y-2 flex flex-col ${plan.color} ${plan.featured ? 'scale-110 relative z-10' : ''}`}>
            {plan.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-black text-xs px-4 py-1.5 rounded-full">POPULAR</div>}
            <h3 className={`text-2xl font-black mb-2 ${plan.text}`}>{plan.name}</h3>
            <div className={`text-4xl font-black mb-8 ${plan.text}`}>{plan.price}<span className="text-sm font-bold opacity-60">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((f, j) => (
                <li key={j} className={`flex items-center gap-3 text-sm font-medium ${plan.text}`}>
                  <i className="fa-solid fa-circle-check opacity-70"></i> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-2xl font-black transition-all ${plan.featured ? 'bg-white text-blue-600 shadow-xl hover:shadow-2xl' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionView;
