import { motion } from "framer-motion";
import { CheckCircle, History, Scan } from "lucide-react";

import scan from "../../../public/Containerscan-code.png";
import verify from "../../../public/Containerverify-history.png";
import confirm from "../../../public/Containerconfirm-authencity.png";

const HowItWork = () => {
  const cards = [
    {
      id: 1,
      image: scan,
      title: "Scan Code",
      icon: <Scan className="w-8 h-8 text-primary-faint" />,
      description:
        "Use your device's camera to scan the unique QR code on the medicine package.",
    },
    {
      id: 2,
      image: verify,
      title: "View History",
      icon: <History className="w-8 h-8 text-primary-faint" />,
      description:
        "Instantly access the medicine's blockchain-verified journey from manufacturer to you.",
    },
    {
      id: 3,
      image: confirm,
      title: "Confirm Authenticity",
      icon: <CheckCircle className="w-8 h-8 text-primary-faint" />,
      description:
        "Receive clear confirmation that your medication is genuine and safe for use.",
    },
  ];

  return (
    <div className="relative bg-[#F8FAFC] pt-24 pb-32 overflow-hidden">
      {/* Curved Top Background */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0">
        <svg
          className="relative block w-full h-[120px] md:h-[180px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C360,100 1080,100 1440,0 L1440,120 L0,120 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Section Content */}
      <div className="px-6 md:px-12">
        <div className="text-center space-y-3 relative z-10">
          <h1 className="text-[#101828] text-3xl md:text-4xl font-semibold">
            How It Works
          </h1>
          <p className="text-[#4A5565] max-w-xl mx-auto">
            A simple, transparent, and secure process to ensure your peace of
            mind.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 max-w-6xl mx-auto relative z-10">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-[#E5E7EB] text-center flex flex-col items-center hover:shadow-xl transition-all"
            >
              {/* Step Indicator */}
              <div className="w-12 h-12 flex items-center justify-center bg-primary-faint/10 rounded-full mb-4">
                {card.icon}
              </div>

              {/* <img
                src={card.image}
                alt={card.title}
                className="w-24 h-24 object-contain mb-4"
              /> */}

              <h2 className="text-[#101828] text-xl font-semibold mb-2">
                {card.id}. {card.title}
              </h2>

              <p className="text-[#4A5565] text-sm md:text-base">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWork;
