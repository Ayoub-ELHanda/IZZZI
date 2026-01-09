output "bucket_names" {
  description = "Names of the created Spaces buckets"
  value = {
    terraform_state = digitalocean_spaces_bucket.terraform_state.name
    backups         = digitalocean_spaces_bucket.backups.name
    assets          = digitalocean_spaces_bucket.assets.name
  }
}
