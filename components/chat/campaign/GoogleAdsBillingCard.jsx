import React, { useState } from "react";
import {
  CreditCard,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"; // Asumiendo que usas Lucide o similar

const GoogleAdsBillingCard = ({ billingLink, isConnected }) => {
  const [loading, setLoading] = useState(false);

  const handleOpenBilling = () => {
    // Abrir en nueva pestaña para no sacar al usuario de tu app
    window.open(billingLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div
            className={`p-3 rounded-full ${
              isConnected
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Configuración de Pagos
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Google Ads requiere un método de pago válido para publicar tus
              campañas.
            </p>

            {/* Estado Visual */}
            <div className="mt-3 flex items-center gap-2">
              {isConnected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle size={12} />
                  Cuenta Conectada
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  <AlertTriangle size={12} />
                  Requiere Atención
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4 flex justify-end">
        <button
          onClick={handleOpenBilling}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200"
        >
          Gestionar Facturación en Google
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default GoogleAdsBillingCard;
