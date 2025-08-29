<?php
// contact.php - Gestion professionnelle du formulaire de contact

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validation des données
    $name = trim(htmlspecialchars($_POST['name']));
    $email = trim(htmlspecialchars($_POST['email']));
    $message = trim(htmlspecialchars($_POST['message']));

    // Validation des champs obligatoires
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Tous les champs sont obligatoires.'
        ]);
        exit;
    }

    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Veuillez entrer une adresse email valide.'
        ]);
        exit;
    }

    // Préparation des données pour l'enregistrement
    $contactData = [
        'name' => $name,
        'email' => $email,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s'),
        'ip_address' => $_SERVER['REMOTE_ADDR']
    ];

    try {
        // Enregistrement dans un fichier (pour l'exemple)
        $filename = 'contacts/' . date('Y-m-d') . '_contacts.json';
        if (!file_exists('contacts')) {
            mkdir('contacts', 0777, true);
        }
        
        $existingData = [];
        if (file_exists($filename)) {
            $existingData = json_decode(file_get_contents($filename), true) ?: [];
        }
        
        $existingData[] = $contactData;
        file_put_contents($filename, json_encode($existingData, JSON_PRETTY_PRINT));

        // Envoi d'email (à implémenter selon votre configuration)
        // mail($to, $subject, $message, $headers);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Merci ' . $name . '! Votre message a été envoyé avec succès. Nous vous répondrons bientôt.'
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer.'
        ]);
    }

} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);
}
?>
