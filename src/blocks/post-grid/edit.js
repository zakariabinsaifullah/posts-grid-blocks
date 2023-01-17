import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	Card,
	CardBody,
	CardHeader,
	QueryControls,
} from '@wordpress/components';
const { Fragment, RawHTML } = wp.element;
import { useSelect } from '@wordpress/data';

// import external library
import moment from 'moment';

// editor style
import './editor.scss';

// import custom components
import SingleInput from '../../utilities/components/singleinput/singleinput';
import ColorControl from '../../utilities/components/colorcontrol/colorcontrol';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		uniqueId,
		gridCols,
		gridGaps,
		categories,
		numberOfPosts,
		order,
		orderBy,
		contentBg,
	} = attributes;

	const catIDs =
		categories && categories.length > 0
			? categories.map((cat) => cat.id)
			: [];

	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'post', {
				per_page: numberOfPosts,
				_embed: true,
				order,
				orderby: orderBy,
				categories: catIDs,
			});
		},
		[numberOfPosts, order, orderBy, categories]
	);

	const allCats = useSelect((select) => {
		return select('core').getEntityRecords('taxonomy', 'category', {
			per_page: -1,
		});
	}, []);

	const catSuggestions = {};
	if (allCats) {
		for (let i = 0; i < allCats.length; i++) {
			const cat = allCats[i];
			catSuggestions[cat.name] = cat;
		}
	}

	const onNumberOfItemsChange = (value) => {
		setAttributes({ numberOfPosts: value });
	};

	const onCategoryChange = (values) => {
		const hasNoSuggestions = values.some(
			(value) => typeof value === 'string' && !catSuggestions[value]
		);
		if (hasNoSuggestions) return;

		const updatedCats = values.map((token) => {
			return typeof token === 'string' ? catSuggestions[token] : token;
		});

		setAttributes({ categories: updatedCats });
	};

	// update unique ID
	setAttributes({
		uniqueId: 'pstgb-' + clientId.slice(0, 8),
	});

	return (
		<Fragment>
			<style>
				{`
					${
						contentBg &&
						contentBg !== '' &&
						`.${uniqueId} .grid-content { background-color: ${contentBg}; }`
					}
					@media only screen and (min-width: 1024px) {
						.${uniqueId} .pstgb-grid {
							grid-template-columns: repeat(${gridCols.desktop}, 1fr);
							grid-gap: ${gridGaps.desktop}px;
						}
					}

					@media only screen and (min-width: 768px) and (max-width: 1023px) {
						.${uniqueId} .pstgb-grid {
							grid-template-columns: repeat(${gridCols.tablet}, 1fr);
							grid-gap: ${gridGaps.tablet}px;
						}
					}

					@media only screen and (max-width: 767px) {
						.${uniqueId} .pstgb-grid {
							grid-template-columns: repeat(${gridCols.mobile}, 1fr);
							grid-gap: ${gridGaps.mobile}px;
						}
					}
				`}
			</style>
			<InspectorControls>
				<Card>
					<CardHeader>
						<strong>
							{__('Grid Settings', 'post-grid-blocks')}
						</strong>
					</CardHeader>
					<CardBody>
						<SingleInput
							label={__('Grid Columns', 'post-grid-blocks')}
							attributes={gridCols}
							attributesName={'gridCols'}
							setAttributes={setAttributes}
							min={1}
							max={5}
							unit=""
						/>
						<SingleInput
							label={__('Columns Gap', 'post-grid-blocks')}
							attributes={gridGaps}
							attributesName={'gridGaps'}
							setAttributes={setAttributes}
							min={0}
							max={100}
							unit="px"
						/>
					</CardBody>
				</Card>
				<Card>
					<CardHeader>
						<strong>
							{__('Post Settings', 'post-grid-blocks')}
						</strong>
					</CardHeader>
					<CardBody>
						<QueryControls
							numberOfItems={numberOfPosts}
							onNumberOfItemsChange={onNumberOfItemsChange}
							maxItems={12}
							minItems={1}
							orderBy={orderBy}
							onOrderByChange={(value) =>
								setAttributes({ orderBy: value })
							}
							order={order}
							onOrderChange={(value) =>
								setAttributes({ order: value })
							}
							categorySuggestions={catSuggestions}
							selectedCategories={categories}
							onCategoryChange={onCategoryChange}
						/>
					</CardBody>
				</Card>
				<Card>
					<CardHeader>
						<strong>{__('Style', 'post-grid-blocks')}</strong>
					</CardHeader>
					<CardBody>
						<ColorControl
							label={__('Content Background', 'post-grid-blocks')}
							value={contentBg}
							onChange={(value) =>
								setAttributes({ contentBg: value })
							}
							disableAlpha={false}
						/>
					</CardBody>
				</Card>
			</InspectorControls>

			<div
				{...useBlockProps({
					className: uniqueId,
				})}
			>
				{posts && posts.length > 0 ? (
					<div className="pstgb-grid">
						{posts.map((post, index) => {
							return (
								<div className="grid-item" key={index}>
									<div className="grid-item-box">
										<div className="grid-img-wrap">
											{post._embedded[
												'wp:featuredmedia'
											] &&
												post._embedded[
													'wp:featuredmedia'
												][0].source_url && (
													<img
														alt={
															post.title.rendered
														}
														className="grid-img"
														src={
															post._embedded[
																'wp:featuredmedia'
															][0].source_url
														}
													/>
												)}
											<div className="grid-category">
												{post._embedded[
													'wp:term'
												][0].map((category, i) => {
													return (
														<a
															key={i}
															href={category.link}
															rel="category tag"
														>
															{category.name}
														</a>
													);
												})}
											</div>
										</div>
										<div className="grid-content">
											<div className="grid-content-wrap">
												<div className="grid-meta">
													<div className="grid-author-wrap">
														<span className="grid-by">
															{__(
																'By ',
																'post-grid-blocks'
															)}
														</span>
														<a
															href={
																post._embedded
																	.author[0]
																	.link
															}
														>
															{
																post._embedded
																	.author[0]
																	.name
															}
														</a>
													</div>
													<span className="grid-separator">
														{'//'}
													</span>
													<div className="grid-flex grid-flex-middle">
														<div className="grid-featured-list-date">
															{post.date_gmt &&
																moment(
																	post.date_gmt
																).format(
																	'MMMM DD, YYYY'
																)}
														</div>
													</div>
												</div>
												<h3 className="grid-title">
													<a href={post.link}>
														{post.title.rendered}
													</a>
												</h3>
												<div className="grid-text">
													{post.excerpt && (
														<RawHTML>
															{
																post.excerpt
																	.rendered
															}
														</RawHTML>
													)}
												</div>
												<div className="grid-counter">
													{('0' + (index + 1)).slice(
														-2
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<p>
						{__(
							'No posts found. Please add posts to your site.',
							'post-grid-blocks'
						)}
					</p>
				)}
			</div>
		</Fragment>
	);
}
