<?php
/**
 * One-off helper for T5 retention testing inside Docker.
 * Usage: php sandbox/tests/age_rate_limit.php email:retention-sqlite@example.test
 */

$key = $argv[1] ?? '';
if ($key === '') {
    fwrite(STDERR, "Usage: php age_rate_limit.php <rate_key>\n");
    exit(1);
}

$storage = getenv('RATE_LIMIT_STORAGE') ?: 'json';
$baseDir = __DIR__ . '/../data/rate-limits';
$cutoff = time() - (8 * 86400);

if ($storage === 'sqlite') {
    $db = $baseDir . '/rate_limits.sqlite';
    $pdo = new PDO('sqlite:' . $db);
    $stmt = $pdo->prepare('UPDATE rate_limits SET last_seen = :last_seen WHERE rate_key = :rate_key');
    $stmt->execute(['last_seen' => $cutoff, 'rate_key' => $key]);
    echo json_encode($pdo->query('SELECT rate_key, count, last_seen FROM rate_limits')->fetchAll(PDO::FETCH_ASSOC));
    exit(0);
}

$file = $baseDir . '/json/' . hash('sha256', $key) . '.json';
if (!is_file($file)) {
    fwrite(STDERR, "Missing JSON record for key: $key\n");
    exit(1);
}

$data = json_decode(file_get_contents($file), true);
$data['last_seen'] = $cutoff;
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
echo json_encode($data);
