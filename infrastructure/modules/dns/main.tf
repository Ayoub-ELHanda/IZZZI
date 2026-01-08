# Root domain (e.g., izzzi.io)
resource "digitalocean_record" "root" {
  count  = var.domain_name != "" ? 1 : 0
  domain = var.domain_name
  type   = "A"
  name   = "@"
  value  = var.droplet_ip
  ttl    = 300
}

# WWW subdomain (e.g., www.izzzi.io)
resource "digitalocean_record" "www" {
  count  = var.domain_name != "" ? 1 : 0
  domain = var.domain_name
  type   = "A"
  name   = "www"
  value  = var.droplet_ip
  ttl    = 300
}

# API subdomain (e.g., api.izzzi.io)
resource "digitalocean_record" "api" {
  count  = var.domain_name != "" ? 1 : 0
  domain = var.domain_name
  type   = "A"
  name   = "api"
  value  = var.droplet_ip
  ttl    = 300
}
