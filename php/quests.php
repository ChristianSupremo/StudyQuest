<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'db.php';
header('Content-Type: application/json');

// Dummy user_id (you should use session in real apps)
$user_id = 1;

// Parse input
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Route based on method
switch ($method) {
  case 'GET':
    $result = $conn->query("SELECT * FROM quests WHERE user_id = $user_id");
    $quests = [];
    while ($row = $result->fetch_assoc()) {
      $row['completed'] = boolval($row['completed']);
      $quests[] = $row;
    }
    echo json_encode($quests);
    break;

  case 'POST':
    $stmt = $conn->prepare("INSERT INTO quests (title, emoji, due, xp, completed, user_id) VALUES (?, ?, ?, ?, 0, ?)");
    $stmt->bind_param("sssii", $input['title'], $input['emoji'], $input['due'], $input['xp'], $user_id);
    $stmt->execute();
    $input['id'] = $stmt->insert_id;
    $input['completed'] = false;
    $input['user_id'] = $user_id;
    echo json_encode($input);
    break;

  case 'PUT':
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = intval($params['id']);
    $stmt = $conn->prepare("UPDATE quests SET title=?, emoji=?, due=?, xp=? WHERE id=? AND user_id=?");
    $stmt->bind_param("sssiii", $input['title'], $input['emoji'], $input['due'], $input['xp'], $id, $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    break;

  case 'PATCH':
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = intval($params['id']);
    $completed = $input['completed'] ? 1 : 0;
    $stmt = $conn->prepare("UPDATE quests SET completed=? WHERE id=? AND user_id=?");
    $stmt->bind_param("iii", $completed, $id, $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    break;

  case 'DELETE':
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = intval($params['id']);
    $stmt = $conn->prepare("DELETE FROM quests WHERE id=? AND user_id=?");
    $stmt->bind_param("ii", $id, $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    break;

  default:
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
