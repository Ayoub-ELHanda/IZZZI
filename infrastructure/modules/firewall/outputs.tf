output "firewall_ids" {
  description = "IDs of the created firewalls"
  value = {
    web        = digitalocean_firewall.web.id
    internal   = digitalocean_firewall.internal.id
    management = digitalocean_firewall.management.id
  }
}
