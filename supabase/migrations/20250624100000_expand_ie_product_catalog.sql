-- Expand Ireland product catalog beyond the original five seeded drinks.

insert into products (slug, name, brand, category, country_of_origin, is_non_alcoholic, active)
values
  ('smithwicks', 'Smithwick''s', 'Smithwick''s', 'ale', 'IE', false, true),
  ('bulmers', 'Bulmers', 'Bulmers', 'cider', 'IE', false, true),
  ('rockshore', 'Rockshore', 'Rockshore', 'lager', 'IE', false, true),
  ('heineken', 'Heineken', 'Heineken', 'lager', 'NL', false, true),
  ('carlsberg', 'Carlsberg', 'Carlsberg', 'lager', 'DK', false, true),
  ('corona', 'Corona', 'Corona', 'lager', 'MX', false, true),
  ('peroni', 'Peroni', 'Peroni', 'lager', 'IT', false, true),
  ('hop-house-13', 'Hop House 13', 'Guinness', 'lager', 'IE', false, true)
on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  category = excluded.category,
  country_of_origin = excluded.country_of_origin,
  is_non_alcoholic = excluded.is_non_alcoholic,
  active = excluded.active;

insert into product_regions (product_id, country_code, popularity_score)
select id, 'IE',
  case slug
    when 'guinness' then 100
    when 'guinness-00' then 90
    when 'beamish' then 80
    when 'murphys' then 75
    when 'smithwicks' then 70
    when 'bulmers' then 65
    when 'rockshore' then 60
    when 'heineken' then 55
    when 'hop-house-13' then 50
    when 'carlsberg' then 45
    when 'corona' then 40
    when 'peroni' then 35
    when 'other' then 1
    else 10
  end
from products
where slug in (
  'guinness', 'guinness-00', 'beamish', 'murphys', 'smithwicks',
  'bulmers', 'rockshore', 'heineken', 'hop-house-13', 'carlsberg',
  'corona', 'peroni', 'other'
)
on conflict (product_id, country_code) do update set
  popularity_score = excluded.popularity_score,
  active = true;
