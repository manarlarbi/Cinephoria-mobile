import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";

export default function ReservationsScreen() { 
    const [reservations, setReservations] = useState([]);  

    const [selectedReservation, setSelectedReservation] = useState(null);
    const [qrModalVisible, setQrModalVisible] = useState(false);

    useEffect(() => {
        const fetchReservations = async () => {
            const idUtilisateur = await AsyncStorage.getItem("id_utilisateur");
            const token = await AsyncStorage.getItem("token");
            if (!idUtilisateur || !token) {
                return;
            }

            try {
                const res = await fetch(
                    `http://192.168.1.199:3033/reservations/mes-reservations/${idUtilisateur}`,{
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
            
                );


                if (!res.ok)
                    throw new Error("Erreur lors du chargement des réservations.");


                const data = await res.json();
                console.log("les reservations data :",data);
             setReservations(data);

            } catch (err) {
                console.log(err);
            }

        };

        fetchReservations();
    }, []);
    // ouvrir modal
    const openQrModal = (reservation) => {

        setSelectedReservation(reservation);
        setQrModalVisible(true);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>🎟️ Mes Commandes</Text>

            {reservations.length === 0 ? (
                <Text style={styles.noReservations}>
                    Vous n'avez encore aucune réservation.
                </Text>
            ) : (
                <FlatList
                    data={reservations}
                    keyExtractor={(item) => item.id_reservation.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        // ici ouvrir le modal
                            onPress={() => openQrModal(item)}
                            style={styles.card}
                        >
                            <Image source={{ uri: item.affiche_url }} style={styles.image} />

                            <View style={styles.details}>
                                <Text style={styles.title}>{item.titre}</Text>
                                <Text style={styles.text}>
                                    📍 {item.nom_cinema} | Salle {item.id_salle} ({item.qualite})
                                </Text>
                                <Text style={styles.text}>⏰ {item.heure_debut}</Text>
                                <Text style={styles.text}>
                                    🪑 Sièges : {item.places_reservees}
                                </Text>
                                <Text style={styles.text}>💰 {item.prix_total}€</Text>
                                <Text style={styles.smallText}>
                                    📅 Réservé le : {item.date_reservation}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <Modal visible={qrModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedReservation && (
                            <>
                                <Text style={styles.modalTitle}>
                                    {selectedReservation.titre}
                                </Text>
                                <QRCode
                                    value={JSON.stringify({
                                        id: selectedReservation.id_reservation,
                                        titre: selectedReservation.titre,
                                        cinema: selectedReservation.nom_cinema,
                                        heure: selectedReservation.heure_debut,
                                        places: selectedReservation.places_reservees,
                                        prix: selectedReservation.prix_total,
                                    })}
                                    size={250}
                                />
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setQrModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Fermer</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 20,
    },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    noReservations: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#1c1c1c",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 120,
        borderRadius: 5,
        marginRight: 15,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    text: {
        fontSize: 14,
        color: "#bbb",
        marginTop: 2,
    },
    smallText: {
        fontSize: 12,
        color: "#888",
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: "#ff4081",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
