import Client from "../models/Client.js";
import Devis from "../models/Devis.js";
import Facture from "../models/Facture.js";

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const startOfThisMonth = new Date(currentYear, now.getMonth(), 1);
    const startOfLastMonth = new Date(currentYear, now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(currentYear, now.getMonth(), 0);

    const totalClients = await Client.countDocuments();
    const devisAcceptes = await Devis.countDocuments({ status: "accepté" });
    const facturesPayees = await Facture.countDocuments({ status: "payée" });


    const revenusTotauxAgg = await Facture.aggregate([
      { $match: { status: "payée" } },
      { $group: { _id: null, total: { $sum: "$totalTTC" } } },
    ]);
    const revenusTotaux = revenusTotauxAgg[0]?.total || 0;

    // Nouveaux clients
    const clientsCeMois = await Client.countDocuments({
      createdAt: { $gte: startOfThisMonth, $lte: now },
    });
    const clientsMoisPrecedent = await Client.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const devisCeMois = await Devis.countDocuments({
      status: "accepté",
      createdAt: { $gte: startOfThisMonth, $lte: now },
    });
    const devisMoisPrecedent = await Devis.countDocuments({
      status: "accepté",
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const facturesCeMois = await Facture.countDocuments({
      status: "payée",
      invoiceDate: { $gte: startOfThisMonth, $lte: now },
    });
    const facturesMoisPrecedent = await Facture.countDocuments({
      status: "payée",
      invoiceDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const revenusCeMoisAgg = await Facture.aggregate([
      {
        $match: {
          status: "payée",
          invoiceDate: { $gte: startOfThisMonth, $lte: now },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalTTC" } } },
    ]);
    const revenusCeMois = revenusCeMoisAgg[0]?.total || 0;

    const revenusMoisPrecedentAgg = await Facture.aggregate([
      {
        $match: {
          status: "payée",
          invoiceDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalTTC" } } },
    ]);
    const revenusMoisPrecedent = revenusMoisPrecedentAgg[0]?.total || 0;

    const ventesMensuelles = await Facture.aggregate([
      {
        $match: {
          status: "payée",
          invoiceDate: {
            $gte: new Date(currentYear, 0, 1), 
            $lte: new Date(currentYear, 11, 31) 
          }
        }
      },
      {
        $group: {
          _id: { $month: "$invoiceDate" },
          total: { $sum: "$totalTTC" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const ventesMensuellesComplet = [];
    for (let mois = 1; mois <= 12; mois++) {
      const ventesMois = ventesMensuelles.find(v => v._id === mois);
      ventesMensuellesComplet.push({
        mois: mois,
        nomMois: new Date(currentYear, mois - 1, 1).toLocaleString('fr-FR', { month: 'long' }),
        total: ventesMois ? ventesMois.total : 0,
        count: ventesMois ? ventesMois.count : 0
      });
    }


    const calcEvolution = (current, previous) => {
      if (previous === 0 && current > 0) return "+100%";
      if (previous === 0 && current === 0) return "0%";
      const diff = ((current - previous) / previous) * 100;
      return `${diff >= 0 ? "+" : ""}${diff.toFixed(2)}%`;
    };

    const evolution = {
      clients: calcEvolution(clientsCeMois, clientsMoisPrecedent),
      devis: calcEvolution(devisCeMois, devisMoisPrecedent),
      factures: calcEvolution(facturesCeMois, facturesMoisPrecedent),
      revenus: calcEvolution(revenusCeMois, revenusMoisPrecedent),
    };

    const stats = {
      totalClients,
      devisAcceptes,
      facturesPayees,
      revenusTotaux,
      evolution,
      ventesMensuelles: ventesMensuellesComplet,
      periodeCourante: currentYear
    };

    res.json(stats);
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    res.status(500).json({ message: "Erreur lors du calcul des statistiques" });
  }
};